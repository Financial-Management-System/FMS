import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/src/components/ui/dialog';
import { Badge } from '@/src/components/ui/badge';
import { Expense } from './columns';

interface ViewExpenseDialogProps {
  open: boolean;
  onClose: () => void;
  expense: Expense | null;
}

export default function ViewExpenseDialog({ open, onClose, expense }: ViewExpenseDialogProps) {
  if (!expense) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Expense Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Title</label>
              <p className="text-sm">{expense.title}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Category</label>
              <div><Badge variant="outline">{expense.category}</Badge></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Amount</label>
              <p className="text-sm font-semibold">{expense.currency} {expense.amount.toLocaleString()}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Department</label>
              <p className="text-sm">{expense.department}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Vendor</label>
              <p className="text-sm">{expense.vendor}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Date</label>
              <p className="text-sm">{expense.expenseDate}</p>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">Description</label>
            <p className="text-sm">{expense.description}</p>
          </div>

          {expense.receiptNumber && (
            <div>
              <label className="text-sm font-medium text-gray-500">Receipt Number</label>
              <p className="text-sm">{expense.receiptNumber}</p>
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-gray-500">Status</label>
            <div><Badge variant="outline">{expense.status}</Badge></div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}