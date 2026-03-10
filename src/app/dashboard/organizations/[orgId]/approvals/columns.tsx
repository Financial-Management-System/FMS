"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { StatusBadge } from "@/src/components/custom/StatusBadge";
import { CheckCircle, XCircle, Eye, MessageSquare } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/src/components/ui/dialog";
import { useState } from "react";

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

// Approval Actions Component with Balance Dialog
const ApprovalActions = ({ 
  approval, 
  handleApprove, 
  handleReject, 
  handleReview, 
  setSelectedApproval 
}: { 
  approval: Approval;
  handleApprove: (id: string, comments?: string) => void;
  handleReject: (id: string, comments?: string) => void;
  handleReview: (id: string) => void;
  setSelectedApproval: (approval: Approval) => void;
}) => {
  const [showBalanceDialog, setShowBalanceDialog] = useState(false);
  
  // Mock net balance - in real app, this would come from API
  const netBalance = 250000;
  const remainingBalance = netBalance - approval.amount;
  
  const handleApproveClick = () => {
    setShowBalanceDialog(true);
  };
  
  const confirmApproval = () => {
    handleApprove(approval.id, 'Approved after review');
    setShowBalanceDialog(false);
  };
  
  return (
    <>
      <div className="flex gap-1">
        <Button
          size="sm"
          className="bg-emerald-600 hover:bg-emerald-700"
          onClick={handleApproveClick}
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
      
      {/* Balance Confirmation Dialog */}
      <Dialog open={showBalanceDialog} onOpenChange={setShowBalanceDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Approval Confirmation</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">Current Net Balance</p>
                <p className="text-2xl font-bold text-black">${netBalance.toLocaleString()}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">Approval Amount</p>
                <p className="text-2xl font-bold text-black">${approval.amount.toLocaleString()}</p>
              </div>
            </div>
            <div className="border-t pt-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">Remaining Balance After Approval</p>
                <p className={`text-2xl font-bold ${
                  remainingBalance >= 0 ? 'text-black' : 'text-red-600'
                }`}>
                  ${remainingBalance.toLocaleString()}
                </p>
              </div>
            </div>
            {remainingBalance < 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-800">
                  ⚠️ Warning: This approval will exceed the available balance.
                </p>
              </div>
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowBalanceDialog(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-emerald-600 hover:bg-emerald-700" 
              onClick={confirmApproval}
            >
              Confirm Approval
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

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
        <ApprovalActions 
          approval={approval}
          handleApprove={handleApprove}
          handleReject={handleReject}
          handleReview={handleReview}
          setSelectedApproval={setSelectedApproval}
        />
      );
    }
  }
];