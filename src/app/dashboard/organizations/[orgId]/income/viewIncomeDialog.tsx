'use client';

import { z } from 'zod';
import FormDialog from '@/src/components/custom/formDialog';
import { Income } from './columns';

interface ViewIncomeDialogProps {
  open: boolean;
  onClose: () => void;
  income: Income | null;
}

export default function ViewIncomeDialog({ open, onClose, income }: ViewIncomeDialogProps) {
  if (!income) return null;

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      onSubmit={onClose}
      title="Income Details"
      description="View complete income information"
      schema={z.object({
        source: z.string().optional(),
        category: z.string().optional(),
        amount: z.string().optional(),
        currency: z.string().optional(),
        description: z.string().optional(),
        receivedDate: z.string().optional(),
        invoiceNumber: z.string().optional(),
        client: z.string().optional(),
        status: z.string().optional()
      })}
      fields={[
        { name: 'source', label: 'Source', type: 'text' as const },
        { name: 'category', label: 'Category', type: 'text' as const },
        { name: 'amount', label: 'Amount', type: 'text' as const },
        { name: 'currency', label: 'Currency', type: 'text' as const },
        { name: 'description', label: 'Description', type: 'textarea' as const },
        { name: 'receivedDate', label: 'Received Date', type: 'text' as const },
        { name: 'invoiceNumber', label: 'Invoice Number', type: 'text' as const },
        { name: 'client', label: 'Client', type: 'text' as const },
        { name: 'status', label: 'Status', type: 'text' as const }
      ]}
      defaultValues={{
        source: income.source,
        category: income.category,
        amount: `$${income.amount.toLocaleString()}`,
        currency: income.currency,
        description: income.description,
        receivedDate: income.receivedDate,
        invoiceNumber: income.invoiceNumber || 'N/A',
        client: income.client,
        status: income.status
      }}
      submitLabel="Close"
    />
  );
}