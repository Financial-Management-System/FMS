import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/db";
import { RecurringExpense } from "../../../../model/recurringExpense.model";
import mongoose from "mongoose";



function isValidObjectId(id: string) {
  return mongoose.Types.ObjectId.isValid(id);
}

// GET /api/recurring-expenses/:id?organizationId=...
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();

  const { id } = await params;
  if (!isValidObjectId(id)) {
    return NextResponse.json({ ok: false, message: "Invalid id" }, { status: 400 });
  }

  const { searchParams } = new URL(req.url);
  const organizationId = searchParams.get("organizationId");

  if (!organizationId) {
    return NextResponse.json(
      { ok: false, message: "organizationId is required" },
      { status: 400 }
    );
  }

  const doc = await RecurringExpense.findOne({ _id: id, organization: organizationId });
  if (!doc) {
    return NextResponse.json({ ok: false, message: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, data: doc });
}

// PATCH /api/recurring-expenses/:id
// body can include: name, category, vendor, amount, currency, startDate, endDate, frequency, interval,
// dayOfWeek, dayOfMonth, autoPost, paymentMethod, status ("active"/"paused")
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();

  const { id } = await params;
  console.log('PATCH - Received ID:', id);
  
  if (!isValidObjectId(id)) {
    console.log('PATCH - Invalid ObjectId:', id);
    return NextResponse.json({ ok: false, message: "Invalid id" }, { status: 400 });
  }

  const body = await req.json();
  console.log('PATCH - Request body:', body);

  const organizationId = body.organizationId;
  if (!organizationId) {
    return NextResponse.json(
      { ok: false, message: "organizationId is required" },
      { status: 400 }
    );
  }

  console.log('PATCH - Looking for document with ID:', id, 'and organization:', organizationId);
  const doc = await RecurringExpense.findOne({ _id: id, organization: organizationId });
  console.log('PATCH - Found document:', doc ? 'YES' : 'NO');
  
  if (!doc) {
    // Let's also check if the document exists without organization filter
    const docWithoutOrg = await RecurringExpense.findOne({ _id: id });
    console.log('PATCH - Document exists without org filter:', docWithoutOrg ? 'YES' : 'NO');
    if (docWithoutOrg) {
      console.log('PATCH - Document organization:', docWithoutOrg.organization);
    }
    return NextResponse.json({ ok: false, message: "Not found" }, { status: 404 });
  }

  // Allowed fields (avoid updating random fields)
  const allowed = [
    "name",
    "category",
    "vendor",
    "amount",
    "currency",
    "startDate",
    "endDate",
    "frequency",
    "interval",
    "dayOfWeek",
    "dayOfMonth",
    "autoPost",
    "paymentMethod",
    "status",
    "nextRunAt", // optional: admin manual fix
  ] as const;

  for (const key of allowed) {
    if (body[key] !== undefined) {
      if (key === "startDate" || key === "endDate" || key === "nextRunAt") {
        (doc as any)[key] = body[key] ? new Date(body[key]) : null;
      } else if (key === "amount" || key === "interval" || key === "dayOfWeek" || key === "dayOfMonth") {
        (doc as any)[key] = body[key] === null ? null : Number(body[key]);
      } else {
        (doc as any)[key] = body[key];
      }
    }
  }

  // Basic schedule safety rules
  if (doc.frequency === "weekly" && doc.dayOfWeek === null) {
    // optional: keep null allowed, but you can enforce dayOfWeek required
  }
  if (doc.frequency === "monthly" && doc.dayOfMonth === null) {
    // optional: enforce dayOfMonth required
  }

  await doc.save();

  return NextResponse.json({ ok: true, data: doc });
}

// DELETE /api/recurring-expenses/:id
// soft delete: set status = "ended" (recommended)
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();

  const { id } = await params;
  if (!isValidObjectId(id)) {
    return NextResponse.json({ ok: false, message: "Invalid id" }, { status: 400 });
  }

  const { searchParams } = new URL(req.url);
  const organizationId = searchParams.get("organizationId");

  if (!organizationId) {
    return NextResponse.json(
      { ok: false, message: "organizationId is required" },
      { status: 400 }
    );
  }

  const doc = await RecurringExpense.findOne({ _id: id, organization: organizationId });
  if (!doc) {
    return NextResponse.json({ ok: false, message: "Not found" }, { status: 404 });
  }

  doc.status = "ended"; // soft delete
  await doc.save();

  return NextResponse.json({ ok: true, message: "Ended (soft deleted)" });
}
