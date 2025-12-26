'use client';

import { useState } from 'react';
import { Card } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Settings, Plus, Edit, Trash2, Shield, DollarSign, Building, CheckCircle, XCircle } from 'lucide-react';
import  FormDialog  from '@/src/components/custom/formDialog';
import { z } from 'zod';
import { approvalRuleSchema } from '@/src/schema';

interface ApprovalRule {
  id: string;
  ruleName: string;
  requestType: 'Budget' | 'Expense' | 'Payment' | 'Transfer' | 'Purchase' | 'Contract' | 'All';
  minAmount: number;
  maxAmount: number;
  approverRole: string;
  department: string;
  autoApprove?: boolean;
  status: 'Active' | 'Inactive';
  createdAt: string;
}

const mockRules: ApprovalRule[] = [
  {
    id: '1',
    ruleName: 'Small Expense Auto-Approval',
    requestType: 'Expense',
    minAmount: 0,
    maxAmount: 500,
    approverRole: 'Manager',
    department: 'All Departments',
    autoApprove: true,
    status: 'Active',
    createdAt: '2025-01-01'
  },
  {
    id: '2',
    ruleName: 'Medium Expense Approval',
    requestType: 'Expense',
    minAmount: 501,
    maxAmount: 5000,
    approverRole: 'Director',
    department: 'All Departments',
    autoApprove: false,
    status: 'Active',
    createdAt: '2025-01-01'
  },
  {
    id: '3',
    ruleName: 'Large Payment Approval',
    requestType: 'Payment',
    minAmount: 10000,
    maxAmount: 100000,
    approverRole: 'CFO',
    department: 'Finance',
    autoApprove: false,
    status: 'Active',
    createdAt: '2025-01-05'
  },
  {
    id: '4',
    ruleName: 'Budget Request - Engineering',
    requestType: 'Budget',
    minAmount: 0,
    maxAmount: 50000,
    approverRole: 'VP Engineering',
    department: 'Engineering',
    autoApprove: false,
    status: 'Active',
    createdAt: '2025-01-10'
  },
  {
    id: '5',
    ruleName: 'Contract Approval - Legal Review',
    requestType: 'Contract',
    minAmount: 25000,
    maxAmount: 1000000,
    approverRole: 'Legal Team',
    department: 'All Departments',
    autoApprove: false,
    status: 'Active',
    createdAt: '2025-01-12'
  }
];

const formFields = [
  { name: 'ruleName' as const, label: 'Rule Name', type: 'text' as const, placeholder: 'e.g., Small Expense Approval' },
  { 
    name: 'requestType' as const, 
    label: 'Request Type', 
    type: 'select' as const, 
    options: ['Budget', 'Expense', 'Payment', 'Transfer', 'Purchase', 'Contract', 'All'] 
  },
  { name: 'minAmount' as const, label: 'Minimum Amount', type: 'number' as const, placeholder: '0.00' },
  { name: 'maxAmount' as const, label: 'Maximum Amount', type: 'number' as const, placeholder: '0.00' },
  { name: 'approverRole' as const, label: 'Approver Role', type: 'text' as const, placeholder: 'e.g., Manager, Director' },
  { name: 'department' as const, label: 'Department', type: 'text' as const, placeholder: 'Department name or "All Departments"' },
];

export default function OrgApprovalRules() {
  const [rules, setRules] = useState<ApprovalRule[]>(mockRules);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<ApprovalRule | null>(null);
  const [filterType, setFilterType] = useState<string>('All');

  const handleAdd = (data: z.infer<typeof approvalRuleSchema>) => {
    const newRule: ApprovalRule = {
      id: Date.now().toString(),
      ...data,
      status: 'Active',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setRules([newRule, ...rules]);
    setIsAddOpen(false);
  };

  const handleEdit = (data: z.infer<typeof approvalRuleSchema>) => {
    if (!editingRule) return;
    setRules(rules.map(rule =>
      rule.id === editingRule.id
        ? { ...rule, ...data }
        : rule
    ));
    setEditingRule(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this approval rule?')) {
      setRules(rules.filter(rule => rule.id !== id));
    }
  };

  const handleToggleStatus = (id: string) => {
    setRules(rules.map(rule =>
      rule.id === id
        ? { ...rule, status: rule.status === 'Active' ? 'Inactive' as const : 'Active' as const }
        : rule
    ));
  };

  const filteredRules = filterType === 'All' 
    ? rules 
    : rules.filter(rule => rule.requestType === filterType);

  const activeRules = rules.filter(r => r.status === 'Active').length;
  const autoApproveRules = rules.filter(r => r.autoApprove && r.status === 'Active').length;

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Budget': return 'bg-purple-100 text-purple-800';
      case 'Expense': return 'bg-orange-100 text-orange-800';
      case 'Payment': return 'bg-blue-100 text-blue-800';
      case 'Transfer': return 'bg-cyan-100 text-cyan-800';
      case 'Purchase': return 'bg-green-100 text-green-800';
      case 'Contract': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl text-gray-900">Approval Rules</h2>
          <p className="mt-1 text-gray-600">Configure approval thresholds and workflows</p>
        </div>
        <Button onClick={() => setIsAddOpen(true)} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Rule
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Rules</p>
              <p className="mt-1 text-2xl">{rules.length}</p>
              <p className="mt-1 text-xs text-gray-500">Configured</p>
            </div>
            <div className="p-2 rounded-lg bg-emerald-100">
              <Settings className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Rules</p>
              <p className="mt-1 text-2xl">{activeRules}</p>
              <p className="mt-1 text-xs text-gray-500">Currently active</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600">Auto-Approve Rules</p>
              <p className="mt-1 text-2xl">{autoApproveRules}</p>
              <p className="mt-1 text-xs text-gray-500">Automatic approval</p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <Shield className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {['All', 'Budget', 'Expense', 'Payment', 'Transfer', 'Purchase', 'Contract'].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              filterType === type
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Rules List */}
      <div className="space-y-4">
        {filteredRules.map((rule) => (
          <Card key={rule.id} className="p-6 transition-shadow hover:shadow-md">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${
                    rule.status === 'Active' ? 'bg-emerald-100' : 'bg-gray-100'
                  }`}>
                    <Shield className={`w-6 h-6 ${
                      rule.status === 'Active' ? 'text-emerald-600' : 'text-gray-400'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg text-gray-900">{rule.ruleName}</h3>
                        <p className="mt-1 text-sm text-gray-600">
                          Approver: <span className="text-gray-900">{rule.approverRole}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <div className={`px-3 py-1 rounded-full text-xs ${
                          rule.status === 'Active' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {rule.status}
                        </div>
                      </div>
                    </div>

                    {/* Rule Details */}
                    <div className="p-4 mt-3 rounded-lg bg-gray-50">
                      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Amount Range</p>
                            <p className="text-sm text-gray-900">
                              ${rule.minAmount.toLocaleString()} - ${rule.maxAmount.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Building className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Department</p>
                            <p className="text-sm text-gray-900">{rule.department}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Settings className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Auto-Approve</p>
                            <p className="text-sm text-gray-900">
                              {rule.autoApprove ? 'Yes' : 'No'}
                            </p>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Created</p>
                          <p className="text-sm text-gray-900">{rule.createdAt}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mt-4">
                      <div className={`px-3 py-1 rounded-full text-xs ${getTypeColor(rule.requestType)}`}>
                        {rule.requestType}
                      </div>
                      {rule.autoApprove && (
                        <div className="flex items-center gap-1 px-3 py-1 text-xs text-green-800 bg-green-100 rounded-full">
                          <CheckCircle className="w-3 h-3" />
                          <span>Auto-Approve Enabled</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 ml-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleToggleStatus(rule.id)}
                  className={rule.status === 'Active' ? 'text-yellow-600' : 'text-emerald-600'}
                >
                  {rule.status === 'Active' ? (
                    <>
                      <XCircle className="w-4 h-4 mr-2" />
                      Disable
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Enable
                    </>
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEditingRule(rule)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 hover:bg-red-50"
                  onClick={() => handleDelete(rule.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Rule Dialog */}
      <FormDialog
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleAdd}
        title="Create Approval Rule"
        description="Configure a new approval rule and workflow"
        schema={approvalRuleSchema}
        fields={formFields}
        submitLabel="Create Rule"
      />

      {/* Edit Rule Dialog */}
      {editingRule && (
        <FormDialog
          open={!!editingRule}
          onClose={() => setEditingRule(null)}
          onSubmit={handleEdit}
          title="Edit Approval Rule"
          description="Update approval rule configuration"
          schema={approvalRuleSchema}
          fields={formFields}
          defaultValues={{
            ruleName: editingRule.ruleName,
            requestType: editingRule.requestType,
            minAmount: editingRule.minAmount,
            maxAmount: editingRule.maxAmount,
            approverRole: editingRule.approverRole,
            department: editingRule.department,
            autoApprove: editingRule.autoApprove,
          }}
          submitLabel="Update Rule"
        />
      )}
    </div>
  );
}
