import { NextResponse } from "next/server";
import dbConnect from "@/src/lib/db";
import { Organization } from "@/src/model/organization.model";
import mongoose from "mongoose";

// GET SINGLE ORGANIZATION
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    
    // Check if id is a valid MongoDB ObjectId or use org_id
    let organization;
    if (mongoose.Types.ObjectId.isValid(id) && id.length === 24) {
      organization = await Organization.findById(id);
    } else {
      organization = await Organization.findOne({ org_id: id });
    }
    
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

// UPDATE ORGANIZATION
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();

    // Check if id is a valid MongoDB ObjectId or use org_id
    let organization;
    if (mongoose.Types.ObjectId.isValid(id) && id.length === 24) {
      organization = await Organization.findByIdAndUpdate(
        id,
        body,
        { new: true, runValidators: true }
      );
    } else {
      organization = await Organization.findOneAndUpdate(
        { org_id: id },
        body,
        { new: true, runValidators: true }
      );
    }

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
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;

    // Check if id is a valid MongoDB ObjectId or use org_id
    let organization;
    if (mongoose.Types.ObjectId.isValid(id) && id.length === 24) {
      organization = await Organization.findByIdAndDelete(id);
    } else {
      organization = await Organization.findOneAndDelete({ org_id: id });
    }

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