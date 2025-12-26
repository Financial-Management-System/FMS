"use client";

import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { Edit, Trash2, Calendar, Pause, Play, AlertCircle } from 'lucide-react';
import { StatusBadge } from '@/src/components/custom/StatusBadge';

export interface RecurringExpense {
  id: string;
  name: string;
  category: 'Subscription' | 'Utilities' | 'Rent' | 'Insurance' | 'Licenses' | 'Other';
  amount: number;
  currency: string;
  frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Annually';
  vendor: string;
  description: string;
  startDate: string;
  nextPayment: string;
  status: 'Active' | 'Paused' | 'Cancelled';
}

export const createRecurringExpenseColumns = (
  calculateAnnualCost: (amount: number, frequency: string) => number,
  getCategoryColor: (category: string) => string,
  getFrequencyColor: (frequency: string) => string,
  handleToggleStatus: (id: string) => void,
  setEditingExpense: (expense: RecurringExpense) => void,
  handleCancel: (id: string) => void,
  handleDelete: (id: string) => void
): ColumnDef<RecurringExpense>[] => [
  {
    accessorKey: 'name',
    header: 'Expense Name',
    cell: ({ row }) => (
      <div>
        <p className="text-sm">{row.getValue('name')}</p>
      </div>
    )
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => (
      <Badge variant="secondary" className={getCategoryColor(row.getValue('category'))}>
        {row.getValue('category')}
      </Badge>
    )
  },
  {
    accessorKey: 'vendor',
    header: 'Vendor',
    cell: ({ row }) => (
      <span className="text-sm text-gray-600">{row.getValue('vendor')}</span>
    )
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => {
      const amount = row.getValue('amount') as number;
      const frequency = row.original.frequency;
      const annualCost = calculateAnnualCost(amount, frequency);
      return (
        <div>
          <p className="text-sm text-gray-900">${amount.toLocaleString()}</p>
          <p className="text-xs text-gray-500">${annualCost.toLocaleString()}/year</p>
        </div>
      );
    }
  },
  {
    accessorKey: 'frequency',
    header: 'Frequency',
    cell: ({ row }) => (
      <Badge variant="secondary" className={getFrequencyColor(row.getValue('frequency'))}>
        {row.getValue('frequency')}
      </Badge>
    )
  },
  {
    accessorKey: 'startDate',
    header: 'Start Date',
    cell: ({ row }) => (
      <span className="text-sm text-gray-600">{row.getValue('startDate')}</span>
    )
  },
  {
    accessorKey: 'nextPayment',
    header: 'Next Payment',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 text-gray-400" />
        <span className="text-sm text-gray-600">{row.getValue('nextPayment')}</span>
      </div>
    )
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <StatusBadge status={row.getValue('status')} />
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const expense = row.original;
      return (
        <div className="flex gap-2">
          {expense.status !== 'Cancelled' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleToggleStatus(expense.id)}
            >
              {expense.status === 'Active' ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={() => setEditingExpense(expense)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          {expense.status !== 'Cancelled' && (
            <Button
              size="sm"
              variant="outline"
              className="text-orange-600 hover:bg-orange-50"
              onClick={() => handleCancel(expense.id)}
              title="Cancel subscription"
            >
              <AlertCircle className="w-4 h-4" />
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            className="text-red-600 hover:bg-red-50"
            onClick={() => handleDelete(expense.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      );
    }
  }
];