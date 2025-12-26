"use client";

import { useState } from 'react';
import { Card } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Users, Plus, DollarSign, Calendar, Clock } from 'lucide-react';
import FormDialog from '@/src/components/custom/formDialog';
import { z } from 'zod';
import { payrollSchema } from '@/src/schema';
import { DataTable } from '@/src/components/dataTable/dataTable';
import { StatCard } from '@/src/components/custom/statCard';
import { Payroll, createPayrollColumns } from './columns';


const mockPayroll: Payroll[] = [
  {
    id: '1',
    employeeName: 'John Smith',
    employeeId: 'EMP-001',
    position: 'Senior Software Engineer',
    department: 'Engineering',
    baseSalary: 9500,
    bonus: 1500,
    deductions: 800,
    payPeriod: 'December 2025',
    paymentDate: '2025-12-31',
    status: 'Scheduled'
  },
  {
    id: '2',
    employeeName: 'Sarah Johnson',
    employeeId: 'EMP-002',
    position: 'Marketing Director',
    department: 'Marketing',
    baseSalary: 11000,
    bonus: 2000,
    deductions: 950,
    payPeriod: 'December 2025',
    paymentDate: '2025-12-31',
    status: 'Scheduled'
  },
  {
    id: '3',
    employeeName: 'Michael Brown',
    employeeId: 'EMP-003',
    position: 'Sales Manager',
    department: 'Sales',
    baseSalary: 8500,
    bonus: 3000,
    deductions: 750,
    payPeriod: 'November 2025',
    paymentDate: '2025-11-30',
    status: 'Paid'
  },
  {
    id: '4',
    employeeName: 'Emily Davis',
    employeeId: 'EMP-004',
    position: 'Product Designer',
    department: 'Design',
    baseSalary: 7500,
    bonus: 500,
    deductions: 650,
    payPeriod: 'December 2025',
    paymentDate: '2025-12-31',
    status: 'Scheduled'
  },
  {
    id: '5',
    employeeName: 'David Wilson',
    employeeId: 'EMP-005',
    position: 'HR Manager',
    department: 'Human Resources',
    baseSalary: 8000,
    bonus: 1000,
    deductions: 700,
    payPeriod: 'December 2025',
    paymentDate: '2025-12-31',
    status: 'Scheduled'
  },
  {
    id: '6',
    employeeName: 'Lisa Anderson',
    employeeId: 'EMP-006',
    position: 'Operations Manager',
    department: 'Operations',
    baseSalary: 8800,
    bonus: 1200,
    deductions: 780,
    payPeriod: 'December 2025',
    paymentDate: '2025-12-31',
    status: 'Pending'
  }
];

const formFields = [
  { name: 'employeeName' as const, label: 'Employee Name', type: 'text' as const, placeholder: 'Full name' },
  { name: 'employeeId' as const, label: 'Employee ID', type: 'text' as const, placeholder: 'EMP-XXX' },
  { name: 'position' as const, label: 'Position', type: 'text' as const, placeholder: 'Job title' },
  { name: 'department' as const, label: 'Department', type: 'text' as const, placeholder: 'Department name' },
  { name: 'baseSalary' as const, label: 'Base Salary', type: 'number' as const, placeholder: '0.00' },
  { name: 'bonus' as const, label: 'Bonus (Optional)', type: 'number' as const, placeholder: '0.00' },
  { name: 'deductions' as const, label: 'Deductions (Optional)', type: 'number' as const, placeholder: '0.00' },
  { name: 'payPeriod' as const, label: 'Pay Period', type: 'text' as const, placeholder: 'e.g., December 2025' },
  { name: 'paymentDate' as const, label: 'Payment Date', type: 'text' as const, placeholder: 'YYYY-MM-DD' },
];

export default function OrgPayroll() {
  const [payrolls, setPayrolls] = useState<Payroll[]>(mockPayroll);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingPayroll, setEditingPayroll] = useState<Payroll | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('All');
  

  const calculateNetPay = (payroll: Payroll) => {
    return payroll.baseSalary + (payroll.bonus || 0) - (payroll.deductions || 0);
  };

  const handleAdd = (data: z.infer<typeof payrollSchema>) => {
    const newPayroll: Payroll = {
      id: Date.now().toString(),
      ...data,
      status: 'Pending'
    };
    setPayrolls([newPayroll, ...payrolls]);
    setIsAddOpen(false);
  };

  const handleEdit = (data: z.infer<typeof payrollSchema>) => {
    if (!editingPayroll) return;
    setPayrolls(payrolls.map(payroll =>
      payroll.id === editingPayroll.id
        ? { ...payroll, ...data }
        : payroll
    ));
    setEditingPayroll(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this payroll entry?')) {
      setPayrolls(payrolls.filter(payroll => payroll.id !== id));
    }
  };

  const handleProcessPayment = (id: string) => {
    setPayrolls(payrolls.map(payroll =>
      payroll.id === id ? { ...payroll, status: 'Paid' as const } : payroll
    ));
  };

  const filteredPayrolls = filterStatus === 'All' 
    ? payrolls 
    : payrolls.filter(payroll => payroll.status === filterStatus);

  const totalPayroll = payrolls.reduce((sum, p) => sum + calculateNetPay(p), 0);
  const scheduledPayroll = payrolls.filter(p => p.status === 'Scheduled').reduce((sum, p) => sum + calculateNetPay(p), 0);
  const pendingPayroll = payrolls.filter(p => p.status === 'Pending').reduce((sum, p) => sum + calculateNetPay(p), 0);

  const columns = createPayrollColumns(
    calculateNetPay,
    handleProcessPayment,
    setEditingPayroll,
    handleDelete
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl text-gray-900">Payroll Management</h2>
          <p className="text-gray-600 mt-1">Manage employee salaries and payroll processing</p>
        </div>
        <Button onClick={() => setIsAddOpen(true)} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Payroll
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total Payroll"
          value={`$${totalPayroll.toLocaleString()}`}
          subtitle={`${payrolls.length} employees`}
          icon={DollarSign}
          variant="emerald"
          size="medium"
        />

        <StatCard
          title="Scheduled"
          value={`$${scheduledPayroll.toLocaleString()}`}
          subtitle={`${payrolls.filter(p => p.status === 'Scheduled').length} payments`}
          icon={Calendar}
          variant="blue"
          size="medium"
        />

        <StatCard
          title="Pending Review"
          value={`$${pendingPayroll.toLocaleString()}`}
          subtitle={`${payrolls.filter(p => p.status === 'Pending').length} awaiting`}
          icon={Clock}
          variant="yellow"
          size="medium"
        />
      </div>


      {/* Filters */}
      <div className="flex gap-2">
        {['All', 'Scheduled', 'Pending', 'Paid'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              filterStatus === status
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Payroll Table */}
      <Card>
        <DataTable
          columns={columns}
          data={filteredPayrolls}
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

      {/* Add Payroll Dialog */}
      <FormDialog
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleAdd}
        title="Add Payroll Entry"
        description="Create a new payroll entry for an employee"
        schema={payrollSchema}
        fields={formFields}
        submitLabel="Add Payroll"
      />

      {/* Edit Payroll Dialog */}
      {editingPayroll && (
        <FormDialog
          open={!!editingPayroll}
          onClose={() => setEditingPayroll(null)}
          onSubmit={handleEdit}
          title="Edit Payroll Entry"
          description="Update payroll entry details"
          schema={payrollSchema}
          fields={formFields}
          defaultValues={{
            employeeName: editingPayroll.employeeName,
            employeeId: editingPayroll.employeeId,
            position: editingPayroll.position,
            department: editingPayroll.department,
            baseSalary: editingPayroll.baseSalary,
            bonus: editingPayroll.bonus || 0,
            deductions: editingPayroll.deductions || 0,
            payPeriod: editingPayroll.payPeriod,
            paymentDate: editingPayroll.paymentDate,
          }}
          submitLabel="Update Payroll"
        />
      )}
    </div>
  );
}
