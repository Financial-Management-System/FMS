import { NextRequest, NextResponse } from 'next/server';
import { sampleAttendance } from '@/src/data/attendance';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const attendance = sampleAttendance.find(a => a._id === id);
    
    if (!attendance) {
      return NextResponse.json(
        { success: false, error: 'Attendance record not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: attendance });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch attendance' },
      { status: 500 }
    );
  }
}