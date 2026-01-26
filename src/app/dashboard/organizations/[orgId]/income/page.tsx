"use client";

import { useState, useEffect, use } from 'react';
import { Card } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { TrendingUp, Plus, DollarSign, Calendar } from 'lucide-react';
import { SearchBar } from '@/src/components/custom/searchBar';
import { StandaloneSelect } from '@/src/components/custom/standaloneSelect';
import FormDialog from '@/src/components/custom/formDialog';
import { z } from 'zod';
import { incomeSchema } from '@/src/schema';
import { DataTable } from '@/src/components/dataTable/dataTable';
import { StatCard } from '@/src/components/custom/statCard';
import { createColumns, Income } from './columns';
import ViewIncomeDialog from './viewIncomeDialog';
import AddIncomeForm from './addIncomeForm';

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

export default function OrgIncome({ params }: { params: Promise<{ orgId: string }> }) {
  const resolvedParams = use(params);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);
  const [viewingIncome, setViewingIncome] = useState<Income | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  useEffect(() => {
    fetchIncomes();
  }, []);

  const fetchIncomes = async () => {
    try {
      const response = await fetch(`/api/income?organizationId=${resolvedParams.orgId}`);
      const result = await response.json();
      if (result.success) {
        const formattedIncomes = result.data.map((income: any) => ({
          id: income._id,
          source: income.source || income.title,
          category: income.category,
          amount: income.amount,
          currency: income.currency,
          description: income.description,
          receivedDate: income.date ? income.date.split('T')[0] : '',
          invoiceNumber: income.referenceNumber || '',
          client: income.client,
          status: income.status
        }));
        setIncomes(formattedIncomes);
      }
    } catch (error) {
      console.error('Failed to fetch incomes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (data: z.infer<typeof incomeSchema>) => {
    try {
      const response = await fetch('/api/income', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, organizationId: resolvedParams.orgId })
      });
      const result = await response.json();
      if (result.success) {
        fetchIncomes();
        setIsAddOpen(false);
      }
    } catch (error) {
      console.error('Failed to add income:', error);
    }
  };

  const handleEdit = async (data: z.infer<typeof incomeSchema>) => {
    if (!editingIncome) return;
    try {
      const response = await fetch(`/api/income/${editingIncome.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      if (result.success) {
        fetchIncomes();
        setEditingIncome(null);
      }
    } catch (error) {
      console.error('Failed to update income:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this income entry?')) {
      try {
        const response = await fetch(`/api/income/${id}`, {
          method: 'DELETE'
        });
        const result = await response.json();
        if (result.success) {
          fetchIncomes();
        }
      } catch (error) {
        console.error('Failed to delete income:', error);
      }
    }
  };

  const handleView = (income: Income) => {
    setViewingIncome(income);
  };

  const filteredIncomes = incomes.filter(income => {
    const matchesSearch = income.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         income.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         income.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || income.category === filterCategory;
    const matchesStatus = filterStatus === 'All' || income.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
  const receivedIncome = incomes.filter(i => i.status === 'Received').reduce((sum, i) => sum + i.amount, 0);
  const pendingIncome = incomes.filter(i => i.status === 'Pending').reduce((sum, i) => sum + i.amount, 0);

  const columns = createColumns(setEditingIncome, handleDelete, handleView);

  if (loading) {
    return <div className="p-6">Loading income data...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl text-gray-900">Income</h2>
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

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search income by source, client, or description..."
            className="md:flex-1"
          />
          
          <div className="flex gap-2 flex-wrap">
            <StandaloneSelect
              value={filterCategory}
              onValueChange={setFilterCategory}
              placeholder="All Categories"
              options={[
                { value: 'All', label: 'All Categories' },
                { value: 'Sales', label: 'Sales' },
                { value: 'Services', label: 'Services' },
                { value: 'Investment', label: 'Investment' },
                { value: 'Grant', label: 'Grant' },
                { value: 'Donation', label: 'Donation' },
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
                { value: 'Received', label: 'Received' },
                { value: 'Pending', label: 'Pending' },
              ]}
              className="w-[140px]"
            />
          </div>
        </div>
      </Card>

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

      {/* Add Income Form (with prompt) */}
      <AddIncomeForm
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleAdd}
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

      {/* View Income Dialog */}
      <ViewIncomeDialog
        open={!!viewingIncome}
        onClose={() => setViewingIncome(null)}
        income={viewingIncome}
      />
    </div>
  );
}