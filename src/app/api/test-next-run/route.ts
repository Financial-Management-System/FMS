//only for testing
//can delete anytime

import { NextResponse } from "next/server";
import { calcNextRunAt } from "../../../lib/recurring/calcNextRunAt";

export async function GET() {
  const from = new Date("2026-01-31T00:00:00.000Z");

  const next = calcNextRunAt({
    from,
    frequency: "monthly",
    interval: 1,
    dayOfMonth: 10,
  });

  return NextResponse.json({
    from,
    next,
  });
}
