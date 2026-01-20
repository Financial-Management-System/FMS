import { NextRequest, NextResponse } from 'next/server';
import { sampleAttendance } from '@/src/data/attendance';

export async function GET() {
  try {
    return NextResponse.json({ success: true, data: sampleAttendance });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch attendance' },
      { status: 500 }
    );
  }
}