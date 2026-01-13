'use client';

import { useState, useEffect, use } from 'react';
import { Card } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { PieChart, Plus, DollarSign, AlertCircle } from 'lucide-react';
import FormDialog from '@/src/components/custom/formDialog';
import { SearchBar } from '@/src/components/custom/searchBar';
import { StandaloneSelect } from '@/src/components/custom/standaloneSelect';
import { DataTable } from '@/src/components/dataTable/dataTable';
import { z } from 'zod';
import { budgetSchema } from '@/src/schema';
import { Budget, createBudgetColumns } from './columns';

const formFields = [
  { name: 'name' as const, label: 'Budget Name', type: 'text' as const, placeholder: 'e.g., Q1 Marketing Budget' },
  { name: 'department' as const, label: 'Department', type: 'text' as const, placeholder: 'Department name' },
  { name: 'category' as const, label: 'Category', type: 'text' as const, placeholder: 'Budget category' },
  { name: 'totalAmount' as const, label: 'Total Budget Amount', type: 'number' as const, placeholder: '0.00' },
  { 
    name: 'period' as const, 
    label: 'Budget Period', 
    type: 'select' as const, 
    options: ['Monthly', 'Quarterly', 'Annually'] 
  },
  { name: 'startDate' as const, label: 'Start Date', type: 'text' as const, placeholder: 'YYYY-MM-DD' },
  { name: 'endDate' as const, label: 'End Date', type: 'text' as const, placeholder: 'YYYY-MM-DD' },
  { name: 'description' as const, label: 'Description', type: 'textarea' as const, placeholder: 'Budget description and purpose' },
];

export default function OrgBudgets({ params }: { params: Promise<{ orgId: string }> }) {
  const resolvedParams = use(params);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterDepartment, setFilterDepartment] = useState('All');

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      const response = await fetch(`/api/budget?organizationId=${resolvedParams.orgId}`);
      const result = await response.json();
      if (result.success) {
        const formattedBudgets = result.data.map((budget: any) => ({
          id: budget._id,
          name: budget.name,
          department: budget.department,
          category: budget.category,
          totalAmount: budget.totalAmount,
          spentAmount: budget.spentAmount,
          period: budget.period,
          startDate: budget.startDate ? budget.startDate.split('T')[0] : '',
          endDate: budget.endDate ? budget.endDate.split('T')[0] : '',
          description: budget.description,
          status: budget.status
        }));
        setBudgets(formattedBudgets);
      }
    } catch (error) {
      console.error('Failed to fetch budgets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (data: z.infer<typeof budgetSchema>) => {
    try {
      const response = await fetch('/api/budget', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, organizationId: resolvedParams.orgId })
      });
      const result = await response.json();
      if (result.success) {
        fetchBudgets();
        setIsAddOpen(false);
      }
    } catch (error) {
      console.error('Failed to add budget:', error);
    }
  };

  const handleEdit = async (data: z.infer<typeof budgetSchema>) => {
    if (!editingBudget) return;
    try {
      const response = await fetch(`/api/budget/${editingBudget.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      if (result.success) {
        fetchBudgets();
        setEditingBudget(null);
      }
    } catch (error) {
      console.error('Failed to update budget:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this budget?')) {
      try {
        const response = await fetch(`/api/budget/${id}`, {
          method: 'DELETE'
        });
        const result = await response.json();
        if (result.success) {
          fetchBudgets();
        }
      } catch (error) {
        console.error('Failed to delete budget:', error);
      }
    }
  };

  const filteredBudgets = budgets.filter(budget => {
    const matchesSearch = budget.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         budget.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         budget.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPeriod = filterPeriod === 'All' || budget.period === filterPeriod;
    const matchesStatus = filterStatus === 'All' || budget.status === filterStatus;
    const matchesDepartment = filterDepartment === 'All' || budget.department === filterDepartment;
    
    return matchesSearch && matchesPeriod && matchesStatus && matchesDepartment;
  });

  const uniqueDepartments = [...new Set(budgets.map(b => b.department))];

  const totalBudget = budgets.reduce((sum, b) => sum + b.totalAmount, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spentAmount, 0);
  const budgetsAtRisk = budgets.filter(b => b.status === 'At Risk' || b.status === 'Over Budget').length;

  const columns = createBudgetColumns(
    (budget) => setEditingBudget(budget),
    (id) => handleDelete(id)
  );

  if (loading) {
    return <div className="p-6">Loading budget data...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl text-gray-900">Budgets</h2>
          <p className="mt-1 text-gray-600">Set and monitor budgets for different departments</p>
        </div>
        <Button onClick={() => setIsAddOpen(true)} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="w-4 h-4 mr-2" />
          Create Budget
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Budget</p>
              <p className="mt-1 text-2xl">${totalBudget.toLocaleString()}</p>
              <p className="mt-1 text-xs text-gray-500">{budgets.length} budgets</p>
            </div>
            <div className="p-2 rounded-lg bg-emerald-100">
              <PieChart className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Spent</p>
              <p className="mt-1 text-2xl">${totalSpent.toLocaleString()}</p>
              <p className="mt-1 text-xs text-gray-500">
                {totalBudget > 0 ? ((totalSpent / totalBudget) * 100).toFixed(1) : 0}% utilized
              </p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600">Budgets at Risk</p>
              <p className="mt-1 text-2xl">{budgetsAtRisk}</p>
              <p className="mt-1 text-xs text-gray-500">Require attention</p>
            </div>
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search budgets by name, department, or category..."
            className="md:flex-1"
          />
          
          <div className="flex gap-2 flex-wrap">
            <StandaloneSelect
              value={filterPeriod}
              onValueChange={setFilterPeriod}
              placeholder="All Periods"
              options={[
                { value: 'All', label: 'All Periods' },
                { value: 'Monthly', label: 'Monthly' },
                { value: 'Quarterly', label: 'Quarterly' },
                { value: 'Annually', label: 'Annually' },
              ]}
              className="w-[140px]"
            />
            
            <StandaloneSelect
              value={filterStatus}
              onValueChange={setFilterStatus}
              placeholder="All Status"
              options={[
                { value: 'All', label: 'All Status' },
                { value: 'On Track', label: 'On Track' },
                { value: 'At Risk', label: 'At Risk' },
                { value: 'Over Budget', label: 'Over Budget' },
              ]}
              className="w-[140px]"
            />
            
            <StandaloneSelect
              value={filterDepartment}
              onValueChange={setFilterDepartment}
              placeholder="All Departments"
              options={[
                { value: 'All', label: 'All Departments' },
                ...uniqueDepartments.map(dept => ({ value: dept, label: dept }))
              ]}
              className="w-[160px]"
            />
          </div>
        </div>
      </Card>

      {/* Budgets Table */}
      <Card className="p-6">
        <DataTable
          columns={columns}
          data={filteredBudgets}
          showPagination={true}
          paginationOptions={{
            pageSizeOptions: [10, 20, 50],
            showRowsPerPage: true,
            showPageInfo: true,
          }}
        />
      </Card>

      {/* Add Budget Dialog */}
      <FormDialog
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleAdd}
        title="Create Budget"
        description="Set up a new budget for tracking expenses"
        schema={budgetSchema}
        fields={formFields}
        submitLabel="Create Budget"
      />

      {/* Edit Budget Dialog */}
      {editingBudget && (
        <FormDialog
          open={!!editingBudget}
          onClose={() => setEditingBudget(null)}
          onSubmit={handleEdit}
          title="Edit Budget"
          description="Update budget details"
          schema={budgetSchema}
          fields={formFields}
          defaultValues={{
            name: editingBudget.name,
            department: editingBudget.department,
            category: editingBudget.category,
            totalAmount: editingBudget.totalAmount,
            period: editingBudget.period,
            startDate: editingBudget.startDate,
            endDate: editingBudget.endDate,
            description: editingBudget.description,
          }}
          submitLabel="Update Budget"
        />
      )}
    </div>
  );
}