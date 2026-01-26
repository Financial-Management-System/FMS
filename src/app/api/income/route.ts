import { NextRequest, NextResponse } from 'next/server';
import { TransactionService } from '../../../service/transaction.service';
import dbConnect from '../../../lib/db';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get('organizationId') || 'default';
    
    const transactions = await TransactionService.getTransactionsByOrganization(organizationId, 'income');
    
    return NextResponse.json({ success: true, data: transactions });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch incomes' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    
    const transactionData = {
      ...body,
      type: 'income',
      title: body.source,
      date: body.receivedDate,
      referenceNumber: body.invoiceNumber,
      organizationId: body.organizationId || 'default'
    };
    
    const transaction = await TransactionService.createTransaction(transactionData);
    
    return NextResponse.json({ success: true, data: transaction });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to create income' },
      { status: 500 }
    );
  }
}