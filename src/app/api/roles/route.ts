import { NextResponse } from "next/server";
import dbConnect from "@/src/lib/db";
import { Role } from "@/src/model/role.model";

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const orgId = searchParams.get("orgId");
    
    if (!orgId) {
      return NextResponse.json({ success: false, message: "Organization ID required" }, { status: 400 });
    }

    const roles = await Role.find({ orgId }).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: roles });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const role = new Role(body);
    await role.save();
    return NextResponse.json({ success: true, data: role }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}