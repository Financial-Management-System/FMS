"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Edit, Trash2, Eye } from "lucide-react";
import { StatusBadge } from "@/src/components/custom/StatusBadge";

export interface Expense {
  id: string;
  title: string;
  category: 'Office' | 'Travel' | 'Equipment' | 'Software' | 'Marketing' | 'Utilities' | 'Other';
  amount: number;
  currency: string;
  department: string;
  description: string;
  vendor: string;
  expenseDate: string;
  receiptNumber?: string;
  status: 'Approved' | 'Pending' | 'Rejected';
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Office': return 'bg-blue-100 text-blue-800';
    case 'Travel': return 'bg-purple-100 text-purple-800';
    case 'Equipment': return 'bg-orange-100 text-orange-800';
    case 'Software': return 'bg-cyan-100 text-cyan-800';
    case 'Marketing': return 'bg-pink-100 text-pink-800';
    case 'Utilities': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const createColumns = (
  setEditingExpense: (expense: Expense) => void,
  handleDelete: (id: string) => void,
  handleView: (expense: Expense) => void
): ColumnDef<Expense>[] => [
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => (
      <div>
        <p className="text-sm">{row.getValue('title')}</p>
        <p className="text-xs text-gray-500">{row.original.description}</p>
      </div>
    ),
    filterFn: (row, id, value) => {
      const searchValue = value.toLowerCase();
      return (
        row.getValue(id).toString().toLowerCase().includes(searchValue) ||
        row.original.description.toLowerCase().includes(searchValue) ||
        row.original.vendor.toLowerCase().includes(searchValue) ||
        row.original.department.toLowerCase().includes(searchValue)
      );
    },
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
    accessorKey: 'department',
    header: 'Department',
    cell: ({ row }) => (
      <span className="text-sm">{row.getValue('department')}</span>
    )
  },
  {
    accessorKey: 'vendor',
    header: 'Vendor',
    cell: ({ row }) => (
      <span className="text-sm">{row.getValue('vendor')}</span>
    )
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => {
      const amount = row.getValue('amount') as number;
      return (
        <div>
          <p className="text-sm text-red-600">
            -${amount.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500">{row.original.currency}</p>
        </div>
      );
    }
  },
  {
    accessorKey: 'expenseDate',
    header: 'Date',
    cell: ({ row }) => (
      <span className="text-sm text-gray-600">{row.getValue('expenseDate')}</span>
    )
  },
  {
    accessorKey: 'receiptNumber',
    header: 'Receipt',
    cell: ({ row }) => {
      const receipt = row.getValue('receiptNumber') as string;
      return receipt ? (
        <span className="text-sm text-gray-600">{receipt}</span>
      ) : (
        <span className="text-xs text-gray-400">—</span>
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
          onClick={() => setEditingExpense(row.original)}
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