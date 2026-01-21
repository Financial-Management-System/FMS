import { NextRequest, NextResponse } from 'next/server';
import { sampleDesignations } from '@/src/data/designations';

export async function GET() {
  try {
    return NextResponse.json({ success: true, data: sampleDesignations });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch designations' },
      { status: 500 }
    );
  }
}