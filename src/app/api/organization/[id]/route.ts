import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { Organization } from "@/src/model/organization.model";
import { connectDB } from "@/src/lib/db";

// UPDATE ORGANIZATION
export async function PUT(req: Request, context: { params: any }) {
  try {
    await connectDB();
    // In Next.js app routes, `context.params` may be a Promise — unwrap it before use
    const params = await context.params;
    const {
      org_id,
      name,
      code,
      industry,
      email,
      phone,
      address,
      country,
      timezone,
      status,
    } = await req.json();

    const id = params.id ?? params._id;

    const organization = await Organization.findByIdAndUpdate(
      id,
      {
        org_id,
        name,
        code,
        industry,
        email,
        phone,
        address,
        country,
        timezone,
        status: status?.toLowerCase(),
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
    console.error("Error updating organization:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update organization",
        error: error.message,
      },
      { status: 500 }
    );
  }
}



type Params = { params: { id: string } };

/**
 * GET /api/organization/[id] - Fetch organization by org_id (e.g. org_1)
 */
export async function GET(_req: Request, { params }: Params) {
  try {
    await connectDB();

    const { id } = params; // id = "org_1"

    const organization = await Organization.findOne({ org_id: id });

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
        data: organization,
      },
      { status: 200 }
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
