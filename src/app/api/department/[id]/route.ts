import { NextResponse } from "next/server";
import dbConnect from "@/src/lib/db";
import { Department } from "@/src/model/department.model";
import mongoose from "mongoose";

// GET SINGLE DEPARTMENT
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    
    const department = await Department.findById(id);
    
    if (!department) {
      return NextResponse.json(
        {
          success: false,
          message: "Department not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: department,
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

// UPDATE DEPARTMENT
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();

    const department = await Department.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    );

    if (!department) {
      return NextResponse.json(
        {
          success: false,
          message: "Department not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Department updated successfully",
        data: department,
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

// DELETE DEPARTMENT
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;

    const department = await Department.findByIdAndDelete(id);

    if (!department) {
      return NextResponse.json(
        {
          success: false,
          message: "Department not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Department deleted successfully",
        data: department,
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
