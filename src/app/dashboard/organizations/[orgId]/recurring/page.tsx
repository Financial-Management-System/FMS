"use client";

import { useState } from 'react';
import { Card } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { Repeat, Plus, Edit, Trash2, DollarSign, Calendar, Building, FileText, Clock, AlertCircle, CheckCircle, Pause, Play } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import FormDialog from '@/src/components/custom/formDialog';
import { z } from 'zod';
import { recurringExpenseSchema } from '@/src/schema';
import { DataTable } from '@/src/components/dataTable/dataTable';
import { StatCard } from '@/src/components/custom/statCard';
import { StatusBadge } from '@/src/components/custom/StatusBadge';

interface RecurringExpense {
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

const mockRecurringExpenses: RecurringExpense[] = [
  {
    id: '1',
    name: 'AWS Cloud Services',
    category: 'Subscription',
    amount: 8500,
    currency: 'USD',
    frequency: 'Monthly',
    vendor: 'Amazon Web Services',
    description: 'Cloud hosting infrastructure and services for production environment',
    startDate: '2024-01-01',
    nextPayment: '2025-12-31',
    status: 'Active'
  },
  {
    id: '2',
    name: 'Office Lease - Downtown',
    category: 'Rent',
    amount: 12000,
    currency: 'USD',
    frequency: 'Monthly',
    vendor: 'Downtown Properties LLC',
    description: '5000 sq ft office space lease in downtown business district',
    startDate: '2023-06-01',
    nextPayment: '2025-12-31',
    status: 'Active'
  },
  {
    id: '3',
    name: 'Microsoft 365 Business',
    category: 'Licenses',
    amount: 2400,
    currency: 'USD',
    frequency: 'Annually',
    vendor: 'Microsoft Corporation',
    description: 'Enterprise licenses for Office suite and collaboration tools (50 users)',
    startDate: '2024-03-15',
    nextPayment: '2026-03-15',
    status: 'Active'
  },
  {
    id: '4',
    name: 'Business Insurance Premium',
    category: 'Insurance',
    amount: 15000,
    currency: 'USD',
    frequency: 'Quarterly',
    vendor: 'Business Insurance Co.',
    description: 'Comprehensive business liability and property insurance coverage',
    startDate: '2024-01-01',
    nextPayment: '2026-01-01',
    status: 'Active'
  },
  {
    id: '5',
    name: 'Slack Enterprise Grid',
    category: 'Subscription',
    amount: 850,
    currency: 'USD',
    frequency: 'Monthly',
    vendor: 'Slack Technologies',
    description: 'Team communication and collaboration platform for entire organization',
    startDate: '2024-02-01',
    nextPayment: '2025-12-31',
    status: 'Active'
  },
  {
    id: '6',
    name: 'Adobe Creative Cloud',
    category: 'Subscription',
    amount: 600,
    currency: 'USD',
    frequency: 'Monthly',
    vendor: 'Adobe Inc.',
    description: 'Creative Suite licenses for design and marketing team (10 users)',
    startDate: '2024-01-15',
    nextPayment: '2025-12-31',
    status: 'Active'
  },
  {
    id: '7',
    name: 'GitHub Enterprise',
    category: 'Subscription',
    amount: 1200,
    currency: 'USD',
    frequency: 'Monthly',
    vendor: 'GitHub Inc.',
    description: 'Enterprise source code repository and development tools',
    startDate: '2023-09-01',
    nextPayment: '2025-12-31',
    status: 'Active'
  },
  {
    id: '8',
    name: 'Internet & Phone Service',
    category: 'Utilities',
    amount: 450,
    currency: 'USD',
    frequency: 'Monthly',
    vendor: 'Business Telecom',
    description: 'High-speed internet and VoIP phone system for office',
    startDate: '2023-06-01',
    nextPayment: '2025-12-31',
    status: 'Active'
  }
];

const formFields = [
  { name: 'name' as const, label: 'Expense Name', type: 'text' as const, placeholder: 'e.g., AWS Cloud Services' },
  { 
    name: 'category' as const, 
    label: 'Category', 
    type: 'select' as const, 
    options: ['Subscription', 'Utilities', 'Rent', 'Insurance', 'Licenses', 'Other'] 
  },
  { name: 'amount' as const, label: 'Amount', type: 'number' as const, placeholder: '0.00' },
  { name: 'currency' as const, label: 'Currency', type: 'text' as const, placeholder: 'USD' },
  { 
    name: 'frequency' as const, 
    label: 'Frequency', 
    type: 'select' as const, 
    options: ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Annually'] 
  },
  { name: 'vendor' as const, label: 'Vendor', type: 'text' as const, placeholder: 'Vendor name' },
  { name: 'description' as const, label: 'Description', type: 'textarea' as const, placeholder: 'Detailed description' },
  { name: 'startDate' as const, label: 'Start Date', type: 'text' as const, placeholder: 'YYYY-MM-DD' },
  { name: 'nextPayment' as const, label: 'Next Payment Date', type: 'text' as const, placeholder: 'YYYY-MM-DD' },
];

export default function OrgRecurringExpenses() {
  const [expenses, setExpenses] = useState<RecurringExpense[]>(mockRecurringExpenses);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<RecurringExpense | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterFrequency, setFilterFrequency] = useState<string>('All');

  const handleAdd = (data: z.infer<typeof recurringExpenseSchema>) => {
    const newExpense: RecurringExpense = {
      id: Date.now().toString(),
      ...data,
      status: 'Active'
    };
    setExpenses([newExpense, ...expenses]);
    setIsAddOpen(false);
  };

  const handleEdit = (data: z.infer<typeof recurringExpenseSchema>) => {
    if (!editingExpense) return;
    setExpenses(expenses.map(expense =>
      expense.id === editingExpense.id
        ? { ...expense, ...data }
        : expense
    ));
    setEditingExpense(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this recurring expense?')) {
      setExpenses(expenses.filter(expense => expense.id !== id));
    }
  };

  const handleToggleStatus = (id: string) => {
    setExpenses(expenses.map(expense =>
      expense.id === id
        ? { ...expense, status: expense.status === 'Active' ? 'Paused' as const : 'Active' as const }
        : expense
    ));
  };

  const handleCancel = (id: string) => {
    if (confirm('Are you sure you want to cancel this recurring expense?')) {
      setExpenses(expenses.map(expense =>
        expense.id === id ? { ...expense, status: 'Cancelled' as const } : expense
      ));
    }
  };

  const calculateAnnualCost = (amount: number, frequency: string) => {
    const multipliers: Record<string, number> = {
      'Daily': 365,
      'Weekly': 52,
      'Monthly': 12,
      'Quarterly': 4,
      'Annually': 1
    };
    return amount * (multipliers[frequency] || 1);
  };

  let filteredExpenses = expenses;
  if (filterCategory !== 'All') {
    filteredExpenses = filteredExpenses.filter(e => e.category === filterCategory);
  }
  if (filterFrequency !== 'All') {
    filteredExpenses = filteredExpenses.filter(e => e.frequency === filterFrequency);
  }

  const totalMonthly = expenses
    .filter(e => e.status === 'Active')
    .reduce((sum, e) => {
      const annualCost = calculateAnnualCost(e.amount, e.frequency);
      return sum + (annualCost / 12);
    }, 0);

  const totalAnnual = expenses
    .filter(e => e.status === 'Active')
    .reduce((sum, e) => sum + calculateAnnualCost(e.amount, e.frequency), 0);

  const activeCount = expenses.filter(e => e.status === 'Active').length;

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Subscription': return 'bg-blue-100 text-blue-800';
      case 'Utilities': return 'bg-green-100 text-green-800';
      case 'Rent': return 'bg-purple-100 text-purple-800';
      case 'Insurance': return 'bg-orange-100 text-orange-800';
      case 'Licenses': return 'bg-cyan-100 text-cyan-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case 'Daily': return 'bg-red-100 text-red-800';
      case 'Weekly': return 'bg-orange-100 text-orange-800';
      case 'Monthly': return 'bg-blue-100 text-blue-800';
      case 'Quarterly': return 'bg-purple-100 text-purple-800';
      case 'Annually': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-emerald-100 text-emerald-800';
      case 'Paused': return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active': return <CheckCircle className="w-4 h-4" />;
      case 'Paused': return <Clock className="w-4 h-4" />;
      case 'Cancelled': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const columns: ColumnDef<RecurringExpense>[] = [
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl text-gray-900">Recurring Expenses</h2>
          <p className="text-gray-600 mt-1">Manage subscriptions and recurring payments</p>
        </div>
        <Button onClick={() => setIsAddOpen(true)} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Recurring Expense
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Monthly Cost"
          value={`$${totalMonthly.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
          subtitle="Average per month"
          icon={DollarSign}
          variant="blue"
          size="medium"
        />

        <StatCard
          title="Annual Cost"
          value={`$${totalAnnual.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
          subtitle="Total yearly"
          icon={Repeat}
          variant="emerald"
          size="medium"
        />

        <StatCard
          title="Active Expenses"
          value={activeCount}
          subtitle="Currently active"
          icon={CheckCircle}
          variant="purple"
          size="medium"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex gap-2">
          <span className="text-sm text-gray-600 py-2">Category:</span>
          {['All', 'Subscription', 'Utilities', 'Rent', 'Insurance', 'Licenses', 'Other'].map((category) => (
            <button
              key={category}
              onClick={() => setFilterCategory(category)}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                filterCategory === category
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        
        <div className="flex gap-2">
          <span className="text-sm text-gray-600 py-2">Frequency:</span>
          {['All', 'Monthly', 'Quarterly', 'Annually'].map((frequency) => (
            <button
              key={frequency}
              onClick={() => setFilterFrequency(frequency)}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                filterFrequency === frequency
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {frequency}
            </button>
          ))}
        </div>
      </div>

      {/* Recurring Expenses Table */}
      <Card>
        <DataTable
          columns={columns}
          data={filteredExpenses}
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

      {/* Add Recurring Expense Dialog */}
      <FormDialog
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleAdd}
        title="Add Recurring Expense"
        description="Create a new recurring expense or subscription"
        schema={recurringExpenseSchema}
        fields={formFields}
        submitLabel="Add Recurring Expense"
      />

      {/* Edit Recurring Expense Dialog */}
      {editingExpense && (
        <FormDialog
          open={!!editingExpense}
          onClose={() => setEditingExpense(null)}
          onSubmit={handleEdit}
          title="Edit Recurring Expense"
          description="Update recurring expense details"
          schema={recurringExpenseSchema}
          fields={formFields}
          defaultValues={{
            name: editingExpense.name,
            category: editingExpense.category,
            amount: editingExpense.amount,
            currency: editingExpense.currency,
            frequency: editingExpense.frequency,
            vendor: editingExpense.vendor,
            description: editingExpense.description,
            startDate: editingExpense.startDate,
            nextPayment: editingExpense.nextPayment,
          }}
          submitLabel="Update Recurring Expense"
        />
      )}
    </div>
  );
}
