import { NextResponse } from "next/server";
import { connectDB } from "@/src/lib/db";
import { Organization } from "@/src/model/organization.model";
import mongoose from "mongoose";
import { validateBody } from "@/src/lib/validate";
import { organizationCreateSchema } from "@/src/validators/organization.schema";
import generateOrgId from "@/src/utils/functions";
import { paginate } from "@/src/service/pagination.service";
// CREATE ORGANIZATION




export async function POST(req: Request) {
  try {
    await connectDB();

    // ✅ Validate request body
    const result = await validateBody(req, organizationCreateSchema);
    if (!result.ok) return result.res;

    // ✅ Generate org_id like org_1, org_2...
    const generatedOrgId =
      result.data.org_id || (await generateOrgId());

    // Create organization
    const created = await Organization.create({
      ...result.data,
      org_id: generatedOrgId,
      status: result.data.status?.toLowerCase() || "active",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Organization created successfully",
        data: created,
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        message: err.message,
      },
      { status: 400 }
    );
  }
}


// // GET ALL ORGANIZATIONS
// export async function GET() {
//   try {
//     await connectDB();

//     const organizations = await Organization.find().sort({ createdAt: -1 });

//     return NextResponse.json(organizations);
//   } catch (error: any) {
//     console.error("Error fetching organizations:", error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

// Get organizations with pagination + search

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    // Pagination params
    const page = Math.max(1, Number(searchParams.get("page") ?? 1));
    const limit = Math.min(
      100,
      Math.max(1, Number(searchParams.get("limit") ?? 10))
    );
    const q = (searchParams.get("q") ?? "").trim();

    // Paginated query
    const result = await paginate(Organization, {
      page,
      limit,
      q,
      searchFields: [
        "org_id",
        "name",
        "code",
        "industry",
        "email",
        "country",
      ],
      sortBy: "createdAt",
      sortOrder: -1, // newest first
    });

    return NextResponse.json(
      {
        success: true,
        ...result,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}
