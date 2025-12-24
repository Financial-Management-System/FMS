import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { StatusBadge } from '@/src/components/custom/StatusBadge';

export interface FinancialOperation {
  id: string;
  operationId: string;
  date: string;
  description: string;
  category: 'Income' | 'Expense' | 'Transfer' | 'Investment' | 'Payroll' | 'Tax';
  amount: number;
  status: 'Completed' | 'Pending' | 'Failed' | 'Processing';
  type: 'Credit' | 'Debit';
  reference?: string;
  createdBy: string;
}

export const columns: ColumnDef<FinancialOperation>[] = [
  {
    accessorKey: 'operationId',
    header: 'Operation ID',
    cell: ({ getValue }) => (
      <span className="text-sm font-mono text-gray-900">{getValue() as string}</span>
    )
  },
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ getValue }) => (
      <span className="text-sm text-gray-600">
        {new Date(getValue() as string).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        })}
      </span>
    )
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ getValue, row }) => (
      <div>
        <p className="text-sm text-gray-900">{getValue() as string}</p>
        {row.original.reference && (
          <p className="text-xs text-gray-500 mt-0.5">Ref: {row.original.reference}</p>
        )}
      </div>
    )
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ getValue }) => {
      const value = getValue() as string;
      const getCategoryColor = (category: string) => {
        switch (category) {
          case 'Income': return 'bg-emerald-100 text-emerald-700';
          case 'Expense': return 'bg-red-100 text-red-700';
          case 'Transfer': return 'bg-blue-100 text-blue-700';
          case 'Investment': return 'bg-purple-100 text-purple-700';
          case 'Payroll': return 'bg-orange-100 text-orange-700';
          case 'Tax': return 'bg-yellow-100 text-yellow-700';
          default: return 'bg-gray-100 text-gray-700';
        }
      };

      return (
        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs ${getCategoryColor(value)}`}>
          {value}
        </span>
      );
    }
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ getValue, row }) => {
      const value = getValue() as number;
      return (
        <div className="text-sm">
          <span className={row.original.type === 'Credit' ? 'text-emerald-600' : 'text-red-600'}>
            {row.original.type === 'Credit' ? '+' : '-'}${value.toLocaleString()}
          </span>
        </div>
      );
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => {
      const value = getValue() as string;
      const getStatusVariant = (status: string): 'default' | 'destructive' | 'outline' | 'secondary' => {
        switch (status) {
          case 'Completed': return 'default';
          case 'Pending': return 'secondary';
          case 'Failed': return 'destructive';
          case 'Processing': return 'outline';
          default: return 'outline';
        }
      };

      return <StatusBadge status={value} variant={getStatusVariant(value)} />;
    }
  },
  {
    accessorKey: 'createdBy',
    header: 'Created By',
    cell: ({ getValue }) => (
      <span className="text-sm text-gray-600">{getValue() as string}</span>
    )
  }
];