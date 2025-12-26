"use client";

import { useState } from 'react';
import { Card } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { TrendingUp, Plus, Edit, Trash2, DollarSign, Calendar, User, FileText } from 'lucide-react';
import FormDialog from '@/src/components/custom/formDialog';
import { z } from 'zod';
import { incomeSchema } from '@/src/schema';
import { DataTable } from '@/src/components/dataTable/dataTable';
import { StatCard } from '@/src/components/custom/statCard';
import { StatusBadge } from '@/src/components/custom/StatusBadge';
import { createColumns, Income } from './columns';

const mockIncome: Income[] = [
  {
    id: '1',
    source: 'Enterprise License - Acme Corp',
    category: 'Sales',
    amount: 125000,
    currency: 'USD',
    description: 'Annual enterprise license renewal for 500 users including premium support',
    receivedDate: '2025-12-10',
    invoiceNumber: 'INV-2025-001',
    client: 'Acme Corporation',
    status: 'Received'
  },
  {
    id: '2',
    source: 'Consulting Services - TechStart',
    category: 'Services',
    amount: 45000,
    currency: 'USD',
    description: 'Q4 consulting services for digital transformation project',
    receivedDate: '2025-12-12',
    invoiceNumber: 'INV-2025-002',
    client: 'TechStart Inc.',
    status: 'Received'
  },
  {
    id: '3',
    source: 'Investment Return - Portfolio A',
    category: 'Investment',
    amount: 18500,
    currency: 'USD',
    description: 'Quarterly dividend from technology sector investments',
    receivedDate: '2025-12-08',
    client: 'Investment Fund Partners',
    status: 'Received'
  },
  {
    id: '4',
    source: 'Government Innovation Grant',
    category: 'Grant',
    amount: 75000,
    currency: 'USD',
    description: 'R&D grant for sustainable technology development initiative',
    receivedDate: '2025-12-05',
    invoiceNumber: 'GRANT-2025-AI-001',
    client: 'Department of Innovation',
    status: 'Received'
  },
  {
    id: '5',
    source: 'Product Sales - Q4',
    category: 'Sales',
    amount: 95000,
    currency: 'USD',
    description: 'SaaS subscription renewals and new customer acquisitions for December',
    receivedDate: '2025-12-15',
    invoiceNumber: 'INV-2025-003',
    client: 'Multiple Customers',
    status: 'Pending'
  }
];

const formFields = [
  { name: 'source' as const, label: 'Income Source', type: 'text' as const, placeholder: 'e.g., Enterprise License Sale' },
  { 
    name: 'category' as const, 
    label: 'Category', 
    type: 'select' as const, 
    options: ['Sales', 'Services', 'Investment', 'Grant', 'Donation', 'Other'] 
  },
  { name: 'amount' as const, label: 'Amount', type: 'number' as const, placeholder: '0.00' },
  { name: 'currency' as const, label: 'Currency', type: 'text' as const, placeholder: 'USD' },
  { name: 'description' as const, label: 'Description', type: 'textarea' as const, placeholder: 'Detailed description' },
  { name: 'receivedDate' as const, label: 'Received Date', type: 'text' as const, placeholder: 'YYYY-MM-DD' },
  { name: 'invoiceNumber' as const, label: 'Invoice Number (Optional)', type: 'text' as const, placeholder: 'INV-2025-XXX' },
  { name: 'client' as const, label: 'Client/Payer', type: 'text' as const, placeholder: 'Client or payer name' },
];

export default function OrgIncome() {
  const [incomes, setIncomes] = useState<Income[]>(mockIncome);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('All');

  const handleAdd = (data: z.infer<typeof incomeSchema>) => {
    const newIncome: Income = {
      id: Date.now().toString(),
      ...data,
      status: 'Pending'
    };
    setIncomes([newIncome, ...incomes]);
    setIsAddOpen(false);
  };

  const handleEdit = (data: z.infer<typeof incomeSchema>) => {
    if (!editingIncome) return;
    setIncomes(incomes.map(income =>
      income.id === editingIncome.id
        ? { ...income, ...data }
        : income
    ));
    setEditingIncome(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this income entry?')) {
      setIncomes(incomes.filter(income => income.id !== id));
    }
  };

  const filteredIncomes = filterCategory === 'All' 
    ? incomes 
    : incomes.filter(income => income.category === filterCategory);

  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
  const receivedIncome = incomes.filter(i => i.status === 'Received').reduce((sum, i) => sum + i.amount, 0);
  const pendingIncome = incomes.filter(i => i.status === 'Pending').reduce((sum, i) => sum + i.amount, 0);

  const columns = createColumns(setEditingIncome, handleDelete);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          
          <p className="text-gray-600 mt-1">Track and manage organization income streams</p>
        </div>
        <Button onClick={() => setIsAddOpen(true)} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Income
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total Income"
          value={`$${totalIncome.toLocaleString()}`}
          subtitle={`${incomes.length} entries`}
          icon={TrendingUp}
          variant="emerald"
          size="medium"
        />

        <StatCard
          title="Received"
          value={`$${receivedIncome.toLocaleString()}`}
          subtitle={`${incomes.filter(i => i.status === 'Received').length} payments`}
          icon={DollarSign}
          variant="blue"
          size="medium"
        />

        <StatCard
          title="Pending"
          value={`$${pendingIncome.toLocaleString()}`}
          subtitle={`${incomes.filter(i => i.status === 'Pending').length} awaiting`}
          icon={Calendar}
          variant="yellow"
          size="medium"
        />
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {['All', 'Sales', 'Services', 'Investment', 'Grant', 'Donation', 'Other'].map((category) => (
          <button
            key={category}
            onClick={() => setFilterCategory(category)}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              filterCategory === category
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Income Table */}
      <Card>
        <DataTable
          columns={columns}
          data={filteredIncomes}
          showPagination={true}
          paginationOptions={{
            pageSizeOptions: [10, 20, 30, 50],
            showRowsPerPage: true,
            showFirstLastButtons: true,
            showPageInfo: true,
            showSelectedRows: false,
          }}
        />
      </Card>

      {/* Add Income Dialog */}
      <FormDialog
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleAdd}
        title="Add Income"
        description="Record a new income entry"
        schema={incomeSchema}
        fields={formFields}
        submitLabel="Add Income"
      />

      {/* Edit Income Dialog */}
      {editingIncome && (
        <FormDialog
          open={!!editingIncome}
          onClose={() => setEditingIncome(null)}
          onSubmit={handleEdit}
          title="Edit Income"
          description="Update income entry details"
          schema={incomeSchema}
          fields={formFields}
          defaultValues={{
            source: editingIncome.source,
            category: editingIncome.category,
            amount: editingIncome.amount,
            currency: editingIncome.currency,
            description: editingIncome.description,
            receivedDate: editingIncome.receivedDate,
            invoiceNumber: editingIncome.invoiceNumber || '',
            client: editingIncome.client,
          }}
          submitLabel="Update Income"
        />
      )}
    </div>
  );
}