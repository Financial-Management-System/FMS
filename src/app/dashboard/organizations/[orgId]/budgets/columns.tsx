'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { Edit, Trash2, Calendar, Building, DollarSign } from 'lucide-react';

export interface Budget {
  id: string;
  name: string;
  department: string;
  category: string;
  totalAmount: number;
  spentAmount: number;
  period: 'Monthly' | 'Quarterly' | 'Annually';
  startDate: string;
  endDate: string;
  description: string;
  status: 'On Track' | 'At Risk' | 'Over Budget';
}

interface ColumnActionsProps {
  budget: Budget;
  onEdit: (budget: Budget) => void;
  onDelete: (id: string) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'On Track': return 'bg-emerald-100 text-emerald-800';
    case 'At Risk': return 'bg-yellow-100 text-yellow-800';
    case 'Over Budget': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getUtilizationColor = (percentage: number) => {
  if (percentage < 70) return 'bg-emerald-500';
  if (percentage < 90) return 'bg-yellow-500';
  return 'bg-red-500';
};

export const createBudgetColumns = (
  onEdit: (budget: Budget) => void,
  onDelete: (id: string) => void
): ColumnDef<Budget>[] => [
  {
    accessorKey: 'name',
    header: 'Budget Name',
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium text-gray-900">{row.getValue('name')}</span>
        <span className="text-sm text-gray-500">{row.original.description}</span>
      </div>
    ),
  },
  {
    accessorKey: 'department',
    header: 'Department',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Building className="w-4 h-4 text-gray-400" />
        <span>{row.getValue('department')}</span>
      </div>
    ),
  },
  {
    accessorKey: 'category',
    header: 'Category',
  },
  {
    accessorKey: 'totalAmount',
    header: 'Budget Amount',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <DollarSign className="w-4 h-4 text-gray-400" />
        <span className="font-medium">${row.getValue<number>('totalAmount').toLocaleString()}</span>
      </div>
    ),
  },
  {
    accessorKey: 'spentAmount',
    header: 'Spent',
    cell: ({ row }) => {
      const spent = row.getValue<number>('spentAmount');
      const total = row.original.totalAmount;
      const percentage = Math.min((spent / total) * 100, 100);
      
      return (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span>${spent.toLocaleString()}</span>
            <span className="text-gray-500">{percentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${getUtilizationColor(percentage)}`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'remaining',
    header: 'Remaining',
    cell: ({ row }) => {
      const remaining = row.original.totalAmount - row.original.spentAmount;
      return (
        <span className={`font-medium ${remaining >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
          ${remaining.toLocaleString()}
        </span>
      );
    },
  },
  {
    accessorKey: 'period',
    header: 'Period',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 text-gray-400" />
        <span>{row.getValue('period')}</span>
      </div>
    ),
  },
  {
    accessorKey: 'dateRange',
    header: 'Date Range',
    cell: ({ row }) => (
      <div className="text-sm">
        <div>{row.original.startDate}</div>
        <div className="text-gray-500">to {row.original.endDate}</div>
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge className={getStatusColor(row.getValue('status'))}>
        {row.getValue('status')}
      </Badge>
    ),
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(row.original)}
          className="h-8 w-8 p-0"
        >
          <Edit className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(row.original.id)}
          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    ),
  },
];