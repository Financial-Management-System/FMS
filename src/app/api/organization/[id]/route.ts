import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { Organization } from "@/src/model/organization.model";
import { connectDB } from "@/src/lib/db";
import { validateBody } from "@/src/lib/validate";
import { organizationCreateSchema } from "@/src/validators/organization.schema";

// UPDATE ORGANIZATION
export async function PUT(req: Request, context: { params: any }) {
  try {
    await connectDB();
    // In Next.js app routes, `context.params` may be a Promise — unwrap it before use
    const params = await context.params;
    const id = params.id ?? params._id;

    // ✅ Validate request body
    const result = await validateBody(req, organizationCreateSchema);
    if (!result.ok) return result.res;

    const organization = await Organization.findByIdAndUpdate(
      id,
      {
        ...result.data,
        status: result.data.status || "Active",
        code: result.data.code || result.data.name?.substring(0, 3).toUpperCase(),
        industry: result.data.industry || result.data.category,
        address: result.data.address || result.data.location,
        timezone: result.data.timezone || "UTC",
      },
      { new: true, runValidators: true }
    );

    if (!organization) {
      return NextResponse.json(
        {
          success: false,
          message: "Organization not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Organization updated successfully",
        data: organization,
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

// DELETE ORGANIZATION
export async function DELETE(req: Request, context: { params: any }) {
  try {
    await connectDB();
    const params = await context.params;
    const id = params.id ?? params._id;

    const organization = await Organization.findByIdAndDelete(id);

    if (!organization) {
      return NextResponse.json(
        {
          success: false,
          message: "Organization not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Organization deleted successfully",
        data: organization,
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
