import { Model } from "mongoose";

// Pagination options interface
type PaginationOptions = {
  page: number;           // Current page number
  limit: number;          // Items per page
  sortBy?: string;        // Field to sort by (default: createdAt)
  sortOrder?: 1 | -1;     // Sort direction: 1=asc, -1=desc
  filter?: Record<string, any>; // Additional filters
  q?: string;             // Search query string
  searchFields?: string[]; // Fields to search in
};

/**
 * Generic pagination service for MongoDB collections
 * @param model - Mongoose model to paginate
 * @param options - Pagination configuration
 * @returns Paginated data with metadata
 */
export async function paginate<T>(
  model: Model<T>,
  {
    page,
    limit,
    sortBy = "createdAt",
    sortOrder = -1,
    filter = {},
    q = "",
    searchFields = [],
  }: PaginationOptions
) {
  // Ensure safe page/limit values
  const safePage = Math.max(1, Number(page || 1));
  const safeLimit = Math.min(100, Math.max(1, Number(limit || 10)));
  const skip = (safePage - 1) * safeLimit;

  // Build search condition for text search
  const searchCondition =
    q && searchFields.length
      ? {
          $or: searchFields.map((field) => ({
            [field]: { $regex: q, $options: "i" }, // Case-insensitive regex
          })),
        }
      : {};

  // Combine filters and search conditions
  const finalFilter = { ...filter, ...searchCondition };

  // Execute query and count in parallel for performance
  const [data, total] = await Promise.all([
    model
      .find(finalFilter)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(safeLimit)
      .lean(), // Use lean() for better performance
    model.countDocuments(finalFilter),
  ]);

  const totalPages = Math.ceil(total / safeLimit);

  return {
    data,
    meta: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages,
      hasNext: safePage < totalPages,
      hasPrev: safePage > 1,
    },
  };
}