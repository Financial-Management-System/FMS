import { NextRequest, NextResponse } from 'next/server';
import { sampleDesignations } from '@/src/data/designations';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const designation = sampleDesignations.find(d => d._id === id);
    
    if (!designation) {
      return NextResponse.json(
        { success: false, error: 'Designation not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: designation });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch designation' },
      { status: 500 }
    );
  }
}