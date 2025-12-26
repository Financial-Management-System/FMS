"use client";

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/src/components/ui/badge';
import { StatusBadge } from '@/src/components/custom/StatusBadge';

export type OrgTransaction = {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: string;
  status: string;
  category: string;
};

export const orgTransactionColumns: ColumnDef<OrgTransaction>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue('id')}</span>
    ),
  },
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => (
      <span className="text-gray-600">{row.getValue('date')}</span>
    ),
  },
  {
    accessorKey: 'description',
    header: 'Description',
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => (
      <Badge variant="outline">{row.getValue('category')}</Badge>
    ),
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => {
      const type = row.getValue('type') as string;
      return (
        <Badge 
          className={
            type === 'Income' 
              ? 'bg-emerald-100 text-emerald-700' 
              : 'bg-red-100 text-red-700'
          }
        >
          {type}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => {
      const amount = row.getValue('amount') as number;
      return (
        <div className={`text-right font-semibold ${
          amount > 0 ? 'text-emerald-600' : 'text-red-600'
        }`}>
          {amount > 0 ? '+' : ''}${Math.abs(amount).toLocaleString()}
        </div>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <StatusBadge status={row.getValue('status')} />,
  },
];