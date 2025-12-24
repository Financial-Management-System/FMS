"use client";

import { useState } from 'react';
import { Card } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { DollarSign, TrendingUp, TrendingDown, Activity, Plus, Download, FileText } from 'lucide-react';
import { DataTable } from '@/src/components/custom/DataTable';
import { StatusBadge } from '@/src/components/custom/StatusBadge';
import { StatCard } from '@/src/components/custom/statCard';
import { Edit } from 'lucide-react';
import { columns, FinancialOperation } from './columns';


const mockOperations: FinancialOperation[] = [
  {
    id: '1',
    operationId: 'FO-2025-001',
    date: '2025-12-14',
    description: 'Client Payment - Project Alpha',
    category: 'Income',
    amount: 45000,
    status: 'Completed',
    type: 'Credit',
    reference: 'INV-2025-234',
    createdBy: 'John Smith'
  },
  {
    id: '2',
    operationId: 'FO-2025-002',
    date: '2025-12-14',
    description: 'Office Rent Payment',
    category: 'Expense',
    amount: 8500,
    status: 'Completed',
    type: 'Debit',
    reference: 'RENT-DEC-2025',
    createdBy: 'Finance Team'
  },
  {
    id: '3',
    operationId: 'FO-2025-003',
    date: '2025-12-13',
    description: 'Payroll - December 2025',
    category: 'Payroll',
    amount: 285000,
    status: 'Processing',
    type: 'Debit',
    reference: 'PAYROLL-DEC-2025',
    createdBy: 'HR Department'
  },
  {
    id: '4',
    operationId: 'FO-2025-004',
    date: '2025-12-13',
    description: 'Investment Return - Q4',
    category: 'Investment',
    amount: 12500,
    status: 'Completed',
    type: 'Credit',
    reference: 'INV-RET-Q4',
    createdBy: 'Investment Team'
  },
  {
    id: '5',
    operationId: 'FO-2025-005',
    date: '2025-12-12',
    description: 'Software Licenses - Annual',
    category: 'Expense',
    amount: 15800,
    status: 'Completed',
    type: 'Debit',
    reference: 'LIC-2025-ANNUAL',
    createdBy: 'IT Department'
  },
  {
    id: '6',
    operationId: 'FO-2025-006',
    date: '2025-12-12',
    description: 'Client Payment - Project Beta',
    category: 'Income',
    amount: 67500,
    status: 'Pending',
    type: 'Credit',
    reference: 'INV-2025-235',
    createdBy: 'Sales Team'
  },
  {
    id: '7',
    operationId: 'FO-2025-007',
    date: '2025-12-11',
    description: 'Tax Payment - Q4 2024',
    category: 'Tax',
    amount: 42000,
    status: 'Completed',
    type: 'Debit',
    reference: 'TAX-Q4-2024',
    createdBy: 'Finance Team'
  },
  {
    id: '8',
    operationId: 'FO-2025-008',
    date: '2025-12-11',
    description: 'Fund Transfer - Savings Account',
    category: 'Transfer',
    amount: 50000,
    status: 'Completed',
    type: 'Debit',
    reference: 'TRF-SAV-001',
    createdBy: 'Treasury'
  },
  {
    id: '9',
    operationId: 'FO-2025-009',
    date: '2025-12-10',
    description: 'Marketing Campaign Payment',
    category: 'Expense',
    amount: 22000,
    status: 'Failed',
    type: 'Debit',
    reference: 'MKT-CAM-DEC',
    createdBy: 'Marketing Team'
  },
  {
    id: '10',
    operationId: 'FO-2025-010',
    date: '2025-12-10',
    description: 'Consulting Services Revenue',
    category: 'Income',
    amount: 18500,
    status: 'Completed',
    type: 'Credit',
    reference: 'CONS-2025-089',
    createdBy: 'Consulting Team'
  },
  {
    id: '11',
    operationId: 'FO-2025-011',
    date: '2025-12-09',
    description: 'Equipment Purchase',
    category: 'Expense',
    amount: 34000,
    status: 'Completed',
    type: 'Debit',
    reference: 'EQP-2025-045',
    createdBy: 'Operations'
  },
  {
    id: '12',
    operationId: 'FO-2025-012',
    date: '2025-12-09',
    description: 'Dividend Income',
    category: 'Investment',
    amount: 8750,
    status: 'Completed',
    type: 'Credit',
    reference: 'DIV-Q4-2024',
    createdBy: 'Investment Team'
  },
  {
    id: '13',
    operationId: 'FO-2025-013',
    date: '2025-12-08',
    description: 'Insurance Premium',
    category: 'Expense',
    amount: 12500,
    status: 'Completed',
    type: 'Debit',
    reference: 'INS-DEC-2025',
    createdBy: 'Finance Team'
  },
  {
    id: '14',
    operationId: 'FO-2025-014',
    date: '2025-12-08',
    description: 'Client Payment - Project Gamma',
    category: 'Income',
    amount: 55000,
    status: 'Pending',
    type: 'Credit',
    reference: 'INV-2025-236',
    createdBy: 'Sales Team'
  },
  {
    id: '15',
    operationId: 'FO-2025-015',
    date: '2025-12-07',
    description: 'Utility Bills - Office',
    category: 'Expense',
    amount: 3200,
    status: 'Completed',
    type: 'Debit',
    reference: 'UTIL-DEC-2025',
    createdBy: 'Operations'
  },
];

export default function OrgFinancialOperations() {
  const [operations] = useState<FinancialOperation[]>(mockOperations);
  const [selectedOperation, setSelectedOperation] = useState<FinancialOperation | null>(null);

  // Calculate statistics
  const totalIncome = operations
    .filter(op => op.type === 'Credit' && op.status === 'Completed')
    .reduce((sum, op) => sum + op.amount, 0);

  const totalExpenses = operations
    .filter(op => op.type === 'Debit' && op.status === 'Completed')
    .reduce((sum, op) => sum + op.amount, 0);

  const pendingOperations = operations.filter(op => op.status === 'Pending').length;

  const processingAmount = operations
    .filter(op => op.status === 'Processing')
    .reduce((sum, op) => sum + op.amount, 0);

  // No actions needed for now

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          
          <p className="text-gray-600 mt-1">Track and manage all financial transactions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="w-4 h-4 mr-2" />
            New Operation
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Income"
          value={`$${totalIncome.toLocaleString()}`}
          subtitle="Completed transactions"
          icon={TrendingUp}
          variant="emerald"
        />

        <StatCard
          title="Total Expenses"
          value={`$${totalExpenses.toLocaleString()}`}
          subtitle="Completed transactions"
          icon={TrendingDown}
          variant="red"
        />

        <StatCard
          title="Pending Operations"
          value={pendingOperations}
          subtitle="Awaiting approval"
          icon={Activity}
          variant="yellow"
        />

        <StatCard
          title="Processing"
          value={`$${processingAmount.toLocaleString()}`}
          subtitle="In progress"
          icon={DollarSign}
          variant="blue"
        />
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={operations}
        showPagination={true}
        pageSize={10}
        emptyMessage="No financial operations found"
      />

      {/* Operation Details Modal */}
      {selectedOperation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-xl text-gray-900">Operation Details</h3>
                  <p className="text-sm text-gray-600 mt-1">{selectedOperation.operationId}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedOperation(null)}
                >
                  Close
                </Button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="text-gray-900 mt-1">
                      {new Date(selectedOperation.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <div className="mt-1">
                      <StatusBadge 
                        status={selectedOperation.status} 
                        variant={
                          selectedOperation.status === 'Completed' ? 'default' :
                          selectedOperation.status === 'Pending' ? 'secondary' :
                          selectedOperation.status === 'Failed' ? 'destructive' : 'outline'
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Category</p>
                    <p className="text-gray-900 mt-1">{selectedOperation.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Type</p>
                    <p className="text-gray-900 mt-1">{selectedOperation.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Amount</p>
                    <p className={`text-lg mt-1 ${
                      selectedOperation.type === 'Credit' ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      {selectedOperation.type === 'Credit' ? '+' : '-'}
                      ${selectedOperation.amount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Reference</p>
                    <p className="text-gray-900 mt-1 font-mono text-sm">
                      {selectedOperation.reference || 'N/A'}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Description</p>
                  <p className="text-gray-900 mt-1">{selectedOperation.description}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Created By</p>
                  <p className="text-gray-900 mt-1">{selectedOperation.createdBy}</p>
                </div>
              </div>

              <div className="flex gap-2 mt-6 pt-6 border-t">
                <Button variant="outline" className="flex-1">
                  <FileText className="w-4 h-4 mr-2" />
                  Download Receipt
                </Button>
                <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Operation
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
