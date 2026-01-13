import { NextRequest, NextResponse } from 'next/server';
import { BudgetService } from '../../../service/budget.service';
import { connectDB } from '../../../lib/db';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get('organizationId') || 'default';
    
    const budgets = await BudgetService.getBudgetsByOrganization(organizationId);
    
    return NextResponse.json({ success: true, data: budgets });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch budgets' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    const budgetData = {
      ...body,
      organizationId: body.organizationId || 'default'
    };
    
    const budget = await BudgetService.createBudget(budgetData);
    
    return NextResponse.json({ success: true, data: budget });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to create budget' },
      { status: 500 }
    );
  }
}