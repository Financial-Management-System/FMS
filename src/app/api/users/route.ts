import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/src/lib/db';
import { UserService } from '@/src/service/user.service';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get('organizationId') || 'default';
    
    const users = await UserService.getUsersByOrganization(organizationId);
    
    return NextResponse.json({ success: true, data: users });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    console.log('Received user data:', body);
    
    const userData = {
      name: body.name,
      email: body.email,
      password: body.password,
      role: body.role || 'Standard',
      status: body.status || 'Active',
      balance: body.balance || 0,
      department: body.department || '',
      phone: body.phone || '',
      organizationId: body.organizationId || 'default',
    };
    
    console.log('Creating user with data:', userData);
    const user = await UserService.createUser(userData);
    console.log('User created successfully:', user);
    
    return NextResponse.json({ success: true, data: user });
  } catch (error: any) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to create user' },
      { status: 500 }
    );
  }
}