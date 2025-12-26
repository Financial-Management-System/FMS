'use client';

import { useState } from 'react';
import { Card } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { PieChart, Plus, Edit, Trash2, DollarSign, Calendar, Building, TrendingUp, AlertCircle } from 'lucide-react';
import  FormDialog  from '@/src/components/custom/formDialog';
import { z } from 'zod';
import { budgetSchema } from '@/src/schema';

interface Budget {
  id: string;
  name: string;
  department: string;
  category: string;
  totalAmount: number;
  spentAmount: number;
  period: 'Monthly' | 'Quarterly' | 'Annually';
  startDate: string;
  endDate: string;
  description: string;
  status: 'On Track' | 'At Risk' | 'Over Budget';
}

const mockBudgets: Budget[] = [
  {
    id: '1',
    name: 'Engineering Q1 Budget',
    department: 'Engineering',
    category: 'Development',
    totalAmount: 250000,
    spentAmount: 185000,
    period: 'Quarterly',
    startDate: '2025-01-01',
    endDate: '2025-03-31',
    description: 'Q1 engineering budget covering salaries, tools, and infrastructure',
    status: 'On Track'
  },
  {
    id: '2',
    name: 'Marketing Campaign Budget',
    department: 'Marketing',
    category: 'Advertising',
    totalAmount: 150000,
    spentAmount: 142000,
    period: 'Quarterly',
    startDate: '2025-01-01',
    endDate: '2025-03-31',
    description: 'Digital marketing and advertising campaigns for Q1',
    status: 'At Risk'
  },
  {
    id: '3',
    name: 'Office Operations - Annual',
    department: 'Operations',
    category: 'Facilities',
    totalAmount: 180000,
    spentAmount: 95000,
    period: 'Annually',
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    description: 'Annual budget for office rent, utilities, and maintenance',
    status: 'On Track'
  },
  {
    id: '4',
    name: 'Sales Team - Monthly',
    department: 'Sales',
    category: 'Compensation',
    totalAmount: 85000,
    spentAmount: 91000,
    period: 'Monthly',
    startDate: '2025-12-01',
    endDate: '2025-12-31',
    description: 'Sales team salaries and commissions for December',
    status: 'Over Budget'
  },
  {
    id: '5',
    name: 'R&D Innovation Fund',
    department: 'Engineering',
    category: 'Research',
    totalAmount: 300000,
    spentAmount: 125000,
    period: 'Annually',
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    description: 'Annual R&D budget for new product development and innovation',
    status: 'On Track'
  }
];

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

export default function OrgBudgets() {
  const [budgets, setBudgets] = useState<Budget[]>(mockBudgets);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [filterPeriod, setFilterPeriod] = useState<string>('All');

  const handleAdd = (data: z.infer<typeof budgetSchema>) => {
    const newBudget: Budget = {
      id: Date.now().toString(),
      ...data,
      spentAmount: 0,
      status: 'On Track'
    };
    setBudgets([newBudget, ...budgets]);
    setIsAddOpen(false);
  };

  const handleEdit = (data: z.infer<typeof budgetSchema>) => {
    if (!editingBudget) return;
    setBudgets(budgets.map(budget =>
      budget.id === editingBudget.id
        ? { ...budget, ...data }
        : budget
    ));
    setEditingBudget(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this budget?')) {
      setBudgets(budgets.filter(budget => budget.id !== id));
    }
  };

  const filteredBudgets = filterPeriod === 'All' 
    ? budgets 
    : budgets.filter(budget => budget.period === filterPeriod);

  const totalBudget = budgets.reduce((sum, b) => sum + b.totalAmount, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spentAmount, 0);
  const budgetsAtRisk = budgets.filter(b => b.status === 'At Risk' || b.status === 'Over Budget').length;

  const getUtilizationPercentage = (budget: Budget) => {
    return Math.min((budget.spentAmount / budget.totalAmount) * 100, 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'On Track': return 'bg-emerald-100 text-emerald-800';
      case 'At Risk': return 'bg-yellow-100 text-yellow-800';
      case 'Over Budget': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUtilizationColor = (percentage: number) => {
    if (percentage < 70) return 'bg-emerald-500';
    if (percentage < 90) return 'bg-yellow-500';
    return 'bg-red-500';
  };

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
                {((totalSpent / totalBudget) * 100).toFixed(1)}% utilized
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

      {/* Filters */}
      <div className="flex gap-2">
        {['All', 'Monthly', 'Quarterly', 'Annually'].map((period) => (
          <button
            key={period}
            onClick={() => setFilterPeriod(period)}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              filterPeriod === period
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {period}
          </button>
        ))}
      </div>

      {/* Budgets List */}
      <div className="space-y-4">
        {filteredBudgets.map((budget) => {
          const utilizationPercentage = getUtilizationPercentage(budget);
          const remainingAmount = budget.totalAmount - budget.spentAmount;
          
          return (
            <Card key={budget.id} className="p-6 transition-shadow hover:shadow-md">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg text-gray-900">{budget.name}</h3>
                      <p className="mt-1 text-sm text-gray-600">{budget.description}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs ${getStatusColor(budget.status)}`}>
                      {budget.status}
                    </div>
                  </div>

                  {/* Budget Progress */}
                  <div className="mt-4">
                    <div className="flex justify-between mb-2 text-sm">
                      <span className="text-gray-600">
                        Spent: ${budget.spentAmount.toLocaleString()} of ${budget.totalAmount.toLocaleString()}
                      </span>
                      <span className={`${
                        remainingAmount >= 0 ? 'text-emerald-600' : 'text-red-600'
                      }`}>
                        {remainingAmount >= 0 ? 'Remaining' : 'Over'}: ${Math.abs(remainingAmount).toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full h-3 bg-gray-200 rounded-full">
                      <div
                        className={`h-3 rounded-full transition-all ${getUtilizationColor(utilizationPercentage)}`}
                        style={{ width: `${Math.min(utilizationPercentage, 100)}%` }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      {utilizationPercentage.toFixed(1)}% utilized
                    </p>
                  </div>

                  {/* Budget Details */}
                  <div className="grid grid-cols-2 gap-4 mt-4 md:grid-cols-4">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Department</p>
                        <p className="text-sm text-gray-900">{budget.department}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Category</p>
                        <p className="text-sm text-gray-900">{budget.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Period</p>
                        <p className="text-sm text-gray-900">{budget.period}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Duration</p>
                        <p className="text-sm text-gray-900">{budget.startDate} to {budget.endDate}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingBudget(budget)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 hover:bg-red-50"
                    onClick={() => handleDelete(budget.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Add Budget Dialog */}
      <FormDialog
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleAdd}
        title="Create Budget"
        description="Set up a new budget for a department or project"
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
          description="Update budget details and allocation"
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
