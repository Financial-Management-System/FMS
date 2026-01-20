import { NextRequest, NextResponse } from 'next/server';
import { TransactionService } from '../../../service/transaction.service';
import { connectDB } from '../../../lib/db';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get('organizationId') || 'default';
    
    const transactions = await TransactionService.getTransactionsByOrganization(organizationId, 'expense');
    
    return NextResponse.json({ success: true, data: transactions });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch expenses' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    const transactionData = {
      ...body,
      type: 'expense',
      date: body.expenseDate,
      referenceNumber: body.receiptNumber,
      organizationId: body.organizationId || 'default'
    };
    
    const transaction = await TransactionService.createTransaction(transactionData);
    
    return NextResponse.json({ success: true, data: transaction });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to create expense' },
      { status: 500 }
    );
  }
}