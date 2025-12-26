"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { StatusBadge } from "@/src/components/custom/StatusBadge";
import { CheckCircle, XCircle, Eye, MessageSquare } from "lucide-react";

interface Approval {
  id: string;
  requestType: 'Budget' | 'Expense' | 'Payment' | 'Transfer' | 'Purchase' | 'Contract';
  amount: number;
  department: string;
  description: string;
  justification: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Pending' | 'Approved' | 'Rejected' | 'Under Review';
  requestedBy: string;
  requestedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  comments?: string;
}

interface ColumnsProps {
  handleApprove: (id: string, comments?: string) => void;
  handleReject: (id: string, comments?: string) => void;
  handleReview: (id: string) => void;
  setSelectedApproval: (approval: Approval) => void;
  getPriorityColor: (priority: string) => string;
}

export const createColumns = ({
  handleApprove,
  handleReject,
  handleReview,
  setSelectedApproval,
  getPriorityColor
}: ColumnsProps): ColumnDef<Approval>[] => [
  {
    accessorKey: 'requestType',
    header: 'Type',
    cell: ({ row }) => (
      <span className="text-sm font-medium">{row.getValue('requestType')}</span>
    )
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => (
      <div>
        <p className="text-sm">{row.getValue('description')}</p>
        <p className="text-xs text-gray-500">{row.original.justification.substring(0, 50)}...</p>
      </div>
    )
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => {
      const amount = row.getValue('amount') as number;
      return (
        <span className="text-sm font-semibold text-gray-900">
          ${amount.toLocaleString()}
        </span>
      );
    }
  },
  {
    accessorKey: 'department',
    header: 'Department',
    cell: ({ row }) => (
      <span className="text-sm">{row.getValue('department')}</span>
    )
  },
  {
    accessorKey: 'priority',
    header: 'Priority',
    cell: ({ row }) => (
      <Badge variant="secondary" className={getPriorityColor(row.getValue('priority'))}>
        {row.getValue('priority')}
      </Badge>
    )
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <StatusBadge status={row.getValue('status')} />
  },
  {
    accessorKey: 'requestedBy',
    header: 'Requested By',
    cell: ({ row }) => (
      <span className="text-sm">{row.getValue('requestedBy')}</span>
    )
  },
  {
    accessorKey: 'requestedAt',
    header: 'Requested At',
    cell: ({ row }) => (
      <span className="text-sm text-gray-600">{row.getValue('requestedAt')}</span>
    )
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const approval = row.original;
      const canAct = approval.status === 'Pending' || approval.status === 'Under Review';

      if (!canAct) {
        return (
          <Button
            size="sm"
            variant="outline"
            onClick={() => setSelectedApproval(approval)}
          >
            <MessageSquare className="w-4 h-4" />
          </Button>
        );
      }

      return (
        <div className="flex gap-1">
          <Button
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-700"
            onClick={() => handleApprove(approval.id, 'Approved after review')}
          >
            <CheckCircle className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-red-600 hover:bg-red-50"
            onClick={() => handleReject(approval.id, 'Rejected after review')}
          >
            <XCircle className="w-4 h-4" />
          </Button>
          {approval.status === 'Pending' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleReview(approval.id)}
            >
              <Eye className="w-4 h-4" />
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={() => setSelectedApproval(approval)}
          >
            <MessageSquare className="w-4 h-4" />
          </Button>
        </div>
      );
    }
  }
];