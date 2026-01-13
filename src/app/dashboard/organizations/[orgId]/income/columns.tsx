import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { Edit, Trash2, Eye } from 'lucide-react';
import { StatusBadge } from '@/src/components/custom/StatusBadge';

export interface Income {
  id: string;
  source: string;
  category: 'Sales' | 'Services' | 'Investment' | 'Grant' | 'Donation' | 'Other';
  amount: number;
  currency: string;
  description: string;
  receivedDate: string;
  invoiceNumber?: string;
  client: string;
  status: 'Received' | 'Pending' | 'Overdue';
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Sales': return 'bg-emerald-100 text-emerald-800';
    case 'Services': return 'bg-blue-100 text-blue-800';
    case 'Investment': return 'bg-purple-100 text-purple-800';
    case 'Grant': return 'bg-orange-100 text-orange-800';
    case 'Donation': return 'bg-pink-100 text-pink-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const createColumns = (
  setEditingIncome: (income: Income) => void,
  handleDelete: (id: string) => void,
  handleView: (income: Income) => void
): ColumnDef<Income>[] => [
  {
    accessorKey: 'source',
    header: 'Source',
    cell: ({ row }) => (
      <span className="text-sm">{row.getValue('source')}</span>
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
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => {
      const amount = row.getValue('amount') as number;
      return (
        <span className="text-sm text-emerald-600">
          +${amount.toLocaleString()}
        </span>
      );
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <StatusBadge status={row.getValue('status')} />
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleView(row.original)}
        >
          <Eye className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setEditingIncome(row.original)}
        >
          <Edit className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="text-red-600 hover:bg-red-50"
          onClick={() => handleDelete(row.original.id)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    )
  }
];