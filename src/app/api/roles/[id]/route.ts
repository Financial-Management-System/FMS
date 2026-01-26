import { NextResponse } from "next/server";
import dbConnect from "@/src/lib/db";
import { Role } from "@/src/model/role.model";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const role = await Role.findById(id);
    if (!role) {
      return NextResponse.json({ success: false, message: "Role not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: role });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();
    const role = await Role.findByIdAndUpdate(id, body, { new: true });
    if (!role) {
      return NextResponse.json({ success: false, message: "Role not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: role });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const role = await Role.findByIdAndDelete(id);
    if (!role) {
      return NextResponse.json({ success: false, message: "Role not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Role deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}