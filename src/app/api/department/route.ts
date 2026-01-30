import { NextResponse } from "next/server";
import dbConnect from "@/src/lib/db";
import { Department } from "@/src/model/department.model";

// GET ALL DEPARTMENTS
export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const org_id = searchParams.get("org_id");
    const page = Math.max(1, Number(searchParams.get("page") ?? 1));
    const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") ?? 50)));
    const q = (searchParams.get("q") ?? "").trim();

    if (!org_id) {
      return NextResponse.json({
        success: false,
        message: "Organization ID is required"
      }, { status: 400 });
    }

    let query: any = { org_id };
    
    if (q) {
      query = {
        ...query,
        $or: [
          { name: { $regex: q, $options: 'i' } },
          { description: { $regex: q, $options: 'i' } },
          { manager: { $regex: q, $options: 'i' } }
        ]
      };
    }

    const total = await Department.countDocuments(query);
    const totalPages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;
    
    const data = await Department.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return NextResponse.json({
      success: true,
      data,
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message
    }, { status: 500 });
  }
}

// CREATE DEPARTMENT
export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    
    const department = new Department(body);
    await department.save();
    
    return NextResponse.json({
      success: true,
      message: "Department created successfully",
      data: department
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message
    }, { status: 400 });
  }
}
