import { NextResponse } from 'next/server';
import dbConnect from '@/src/lib/db';
import { Transaction } from '@/src/model/transaction.model';
import { Organization } from '@/src/model/organization.model';

export async function GET() {
    try {
        await dbConnect();

        // Fetch all transactions and organizations
        const [transactions, organizations] = await Promise.all([
            Transaction.find({}).sort({ createdAt: -1 }),
            Organization.find({}).select('org_id name')
        ]);

        // Create a map of organization ID to name
        const orgMap = organizations.reduce((acc: any, org: any) => {
            acc[org.org_id] = org.name;
            return acc;
        }, {});

        // Add company name to transactions
        const enrichedTransactions = transactions.map((txn: any) => ({
            ...txn.toObject(),
            company: orgMap[txn.organizationId] || 'Unknown Organization',
            id: txn._id // Ensure ID is mapped for frontend
        }));

        return NextResponse.json({ success: true, data: enrichedTransactions });
    } catch (error: any) {
        console.error('Failed to fetch transactions:', error);
        return NextResponse.json(
            { success: false, error: error?.message || 'Failed to fetch transactions' },
            { status: 500 }
        );
    }
}
