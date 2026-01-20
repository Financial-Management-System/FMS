"use client";

import { useState, useEffect, use } from 'react';
import { Card } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { TrendingDown, Plus, DollarSign, Calendar } from 'lucide-react';
import { SearchBar } from '@/src/components/custom/searchBar';
import { StandaloneSelect } from '@/src/components/custom/standaloneSelect';
import FormDialog from '@/src/components/custom/formDialog';
import { z } from 'zod';
import { expenseSchema } from '@/src/schema';
import { DataTable } from '@/src/components/dataTable/dataTable';
import { StatCard } from '@/src/components/custom/statCard';
import { createColumns } from './columns';
import ViewExpenseDialog from './viewExpenseDialog';

interface Expense {
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

const formFields = [
  { name: 'title' as const, label: 'Expense Title', type: 'text' as const, placeholder: 'e.g., Office Supplies' },
  { 
    name: 'category' as const, 
    label: 'Category', 
    type: 'select' as const, 
    options: ['Office', 'Travel', 'Equipment', 'Software', 'Marketing', 'Utilities', 'Other'] 
  },
  { name: 'amount' as const, label: 'Amount', type: 'number' as const, placeholder: '0.00' },
  { name: 'currency' as const, label: 'Currency', type: 'text' as const, placeholder: 'USD' },
  { name: 'department' as const, label: 'Department', type: 'text' as const, placeholder: 'Select department' },
  { name: 'description' as const, label: 'Description', type: 'textarea' as const, placeholder: 'Detailed description' },
  { name: 'vendor' as const, label: 'Vendor', type: 'text' as const, placeholder: 'Vendor or supplier name' },
  { name: 'expenseDate' as const, label: 'Expense Date', type: 'text' as const, placeholder: 'YYYY-MM-DD' },
  { name: 'receiptNumber' as const, label: 'Receipt Number (Optional)', type: 'text' as const, placeholder: 'RCP-XXX' },
];

export default function OrgExpenses({ params }: { params: Promise<{ orgId: string }> }) {
  const resolvedParams = use(params);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [viewingExpense, setViewingExpense] = useState<Expense | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await fetch(`/api/expense?organizationId=${resolvedParams.orgId}`);
      const result = await response.json();
      if (result.success) {
        const formattedExpenses = result.data.map((expense: any) => ({
          id: expense._id,
          title: expense.title,
          category: expense.category,
          amount: expense.amount,
          currency: expense.currency,
          department: expense.department,
          description: expense.description,
          vendor: expense.vendor,
          expenseDate: expense.date ? expense.date.split('T')[0] : '',
          receiptNumber: expense.referenceNumber || '',
          status: expense.status
        }));
        setExpenses(formattedExpenses);
      }
    } catch (error) {
      console.error('Failed to fetch expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (data: z.infer<typeof expenseSchema>) => {
    try {
      const response = await fetch('/api/expense', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, organizationId: resolvedParams.orgId })
      });
      const result = await response.json();
      if (result.success) {
        fetchExpenses();
        setIsAddOpen(false);
      }
    } catch (error) {
      console.error('Failed to add expense:', error);
    }
  };

  const handleEdit = async (data: z.infer<typeof expenseSchema>) => {
    if (!editingExpense) return;
    try {
      const response = await fetch(`/api/expense/${editingExpense.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      if (result.success) {
        fetchExpenses();
        setEditingExpense(null);
      }
    } catch (error) {
      console.error('Failed to update expense:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      try {
        const response = await fetch(`/api/expense/${id}`, {
          method: 'DELETE'
        });
        const result = await response.json();
        if (result.success) {
          fetchExpenses();
        }
      } catch (error) {
        console.error('Failed to delete expense:', error);
      }
    }
  };

  const handleView = (expense: Expense) => {
    setViewingExpense(expense);
  };

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || expense.category === filterCategory;
    const matchesStatus = filterStatus === 'All' || expense.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const approvedExpenses = expenses.filter(e => e.status === 'Approved').reduce((sum, e) => sum + e.amount, 0);
  const pendingExpenses = expenses.filter(e => e.status === 'Pending').reduce((sum, e) => sum + e.amount, 0);

  const columns = createColumns(setEditingExpense, handleDelete, handleView);

  if (loading) {
    return <div className="p-6">Loading expense data...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl text-gray-900">Expenses</h2>
          <p className="text-gray-600 mt-1">Track and categorize business expenses</p>
        </div>
        <Button onClick={() => setIsAddOpen(true)} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Expense
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total Expenses"
          value={`$${totalExpenses.toLocaleString()}`}
          subtitle={`${expenses.length} expenses`}
          icon={TrendingDown}
          variant="red"
          size="medium"
        />

        <StatCard
          title="Approved"
          value={`$${approvedExpenses.toLocaleString()}`}
          subtitle={`${expenses.filter(e => e.status === 'Approved').length} expenses`}
          icon={DollarSign}
          variant="emerald"
          size="medium"
        />

        <StatCard
          title="Pending Approval"
          value={`$${pendingExpenses.toLocaleString()}`}
          subtitle={`${expenses.filter(e => e.status === 'Pending').length} awaiting`}
          icon={Calendar}
          variant="yellow"
          size="medium"
        />
      </div>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search expenses by title, vendor, or description..."
            className="md:flex-1"
          />
          
          <div className="flex gap-2 flex-wrap">
            <StandaloneSelect
              value={filterCategory}
              onValueChange={setFilterCategory}
              placeholder="All Categories"
              options={[
                { value: 'All', label: 'All Categories' },
                { value: 'Office', label: 'Office' },
                { value: 'Travel', label: 'Travel' },
                { value: 'Equipment', label: 'Equipment' },
                { value: 'Software', label: 'Software' },
                { value: 'Marketing', label: 'Marketing' },
                { value: 'Utilities', label: 'Utilities' },
                { value: 'Other', label: 'Other' },
              ]}
              className="w-[160px]"
            />
            
            <StandaloneSelect
              value={filterStatus}
              onValueChange={setFilterStatus}
              placeholder="All Status"
              options={[
                { value: 'All', label: 'All Status' },
                { value: 'Approved', label: 'Approved' },
                { value: 'Pending', label: 'Pending' },
                { value: 'Rejected', label: 'Rejected' },
              ]}
              className="w-[140px]"
            />
          </div>
        </div>
      </Card>

      {/* Expenses Table */}
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

      {/* Add Expense Dialog */}
      <FormDialog
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleAdd}
        title="Add Expense"
        description="Record a new business expense"
        schema={expenseSchema}
        fields={formFields}
        submitLabel="Add Expense"
      />

      {/* Edit Expense Dialog */}
      {editingExpense && (
        <FormDialog
          open={!!editingExpense}
          onClose={() => setEditingExpense(null)}
          onSubmit={handleEdit}
          title="Edit Expense"
          description="Update expense details"
          schema={expenseSchema}
          fields={formFields}
          defaultValues={{
            title: editingExpense.title,
            category: editingExpense.category,
            amount: editingExpense.amount,
            currency: editingExpense.currency,
            department: editingExpense.department,
            description: editingExpense.description,
            vendor: editingExpense.vendor,
            expenseDate: editingExpense.expenseDate,
            receiptNumber: editingExpense.receiptNumber || '',
          }}
          submitLabel="Update Expense"
        />
      )}

      {/* View Expense Dialog */}
      <ViewExpenseDialog
        open={!!viewingExpense}
        onClose={() => setViewingExpense(null)}
        expense={viewingExpense}
      />
    </div>
  );
}