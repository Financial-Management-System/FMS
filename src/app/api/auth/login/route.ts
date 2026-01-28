import { NextResponse } from 'next/server';
import dbConnect from '@/src/lib/db';
import { User } from '@/src/model/user.model';
import { Role } from '@/src/model/role.model';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { identifier, password } = await req.json();

    console.log('Login attempt with identifier:', identifier);

    // Find user by username or email
    const user = await User.findOne({
      $or: [
        { username: identifier?.toLowerCase() },
        { email: identifier?.toLowerCase() }
      ]
    });
    
    console.log('User found:', user ? 'Yes' : 'No');
    
    if (!user) {
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
    }

    // Compare password
    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log('Password valid:', isValidPassword);
    
    if (!isValidPassword) {
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
    }

    // Get user's role and permissions
    const role = await Role.findOne({ name: user.role, orgId: user.organizationId });
    const permissions = role?.permissions || [];

    const userData = {
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      orgId: user.organizationId,
      permissions
    };

    return NextResponse.json({
      success: true,
      token: 'dummy-token',
      user: userData
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}