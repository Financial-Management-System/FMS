import { NextResponse } from "next/server";
import dbConnect from "@/src/lib/db";
import { Organization } from "@/src/model/organization.model";

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Number(searchParams.get("page") ?? 1));
    const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") ?? 10)));
    const q = (searchParams.get("q") ?? "").trim();

    let query = {};
    
    if (q) {
      query = {
        $or: [
          { name: { $regex: q, $options: 'i' } },
          { org_id: { $regex: q, $options: 'i' } },
          { industry: { $regex: q, $options: 'i' } }
        ]
      };
    }

    const total = await Organization.countDocuments(query);
    const totalPages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;
    
    const data = await Organization.find(query)
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

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    
    // Generate unique org_id
    const count = await Organization.countDocuments();
    const org_id = `org_${count + 1}`;
    
    const organization = new Organization({
      ...body,
      org_id
    });
    
    await organization.save();
    
    return NextResponse.json({
      success: true,
      message: "Organization created successfully",
      data: organization
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message
    }, { status: 400 });
  }
}