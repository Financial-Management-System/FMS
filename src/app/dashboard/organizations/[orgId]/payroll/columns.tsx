"use client";

import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/src/components/ui/button';
import { Edit, Trash2, CheckCircle, Calendar } from 'lucide-react';
import { StatusBadge } from '@/src/components/custom/StatusBadge';

export interface Payroll {
  id: string;
  employeeName: string;
  employeeId: string;
  position: string;
  department: string;
  baseSalary: number;
  bonus?: number;
  deductions?: number;
  payPeriod: string;
  paymentDate: string;
  status: 'Paid' | 'Pending' | 'Scheduled';
}

export const createPayrollColumns = (
  calculateNetPay: (payroll: Payroll) => number,
  handleProcessPayment: (id: string) => void,
  setEditingPayroll: (payroll: Payroll) => void,
  handleDelete: (id: string) => void
): ColumnDef<Payroll>[] => [
  {
    accessorKey: 'employeeName',
    header: 'Employee',
    cell: ({ row }) => (
      <div>
        <p className="text-sm">{row.getValue('employeeName')}</p>
        <p className="text-xs text-gray-500">{row.original.position}</p>
      </div>
    ),
    filterFn: (row, id, value) => {
      const searchValue = value.toLowerCase();
      return (
        row.getValue(id).toString().toLowerCase().includes(searchValue) ||
        row.original.position.toLowerCase().includes(searchValue) ||
        row.original.employeeId.toLowerCase().includes(searchValue) ||
        row.original.department.toLowerCase().includes(searchValue)
      );
    },
  },
  {
    accessorKey: 'employeeId',
    header: 'Employee ID',
    cell: ({ row }) => (
      <span className="text-sm text-gray-600">{row.getValue('employeeId')}</span>
    )
  },
  {
    accessorKey: 'department',
    header: 'Department',
    cell: ({ row }) => (
      <span className="text-sm text-gray-600">{row.getValue('department')}</span>
    )
  },
  {
    accessorKey: 'baseSalary',
    header: 'Base Salary',
    cell: ({ row }) => (
      <span className="text-sm text-gray-600">${(row.getValue('baseSalary') as number).toLocaleString()}</span>
    )
  },
  {
    accessorKey: 'bonus',
    header: 'Bonus',
    cell: ({ row }) => {
      const bonus = row.getValue('bonus') as number | undefined;
      return bonus ? (
        <span className="text-sm text-emerald-600">+${bonus.toLocaleString()}</span>
      ) : (
        <span className="text-xs text-gray-400">—</span>
      );
    }
  },
  {
    accessorKey: 'deductions',
    header: 'Deductions',
    cell: ({ row }) => {
      const deductions = row.getValue('deductions') as number | undefined;
      return deductions ? (
        <span className="text-sm text-red-600">-${deductions.toLocaleString()}</span>
      ) : (
        <span className="text-xs text-gray-400">—</span>
      );
    }
  },
  {
    id: 'netPay',
    header: 'Net Pay',
    cell: ({ row }) => {
      const netPay = calculateNetPay(row.original);
      return (
        <div>
          <p className="text-sm text-emerald-600">${netPay.toLocaleString()}</p>
        </div>
      );
    }
  },
  {
    accessorKey: 'payPeriod',
    header: 'Pay Period',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 text-gray-400" />
        <p className="text-sm text-gray-900">{row.getValue('payPeriod')}</p>
      </div>
    )
  },
  {
    accessorKey: 'paymentDate',
    header: 'Payment Date',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 text-gray-400" />
        <p className="text-sm text-gray-900">{row.getValue('paymentDate')}</p>
      </div>
    )
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <StatusBadge status={row.getValue('status')} />
    )
  },
  {
    header: 'Actions',
    cell: ({ row }) => {
      const payroll = row.original;
      return (
        <div className="flex gap-2">
          {(payroll.status === 'Pending' || payroll.status === 'Scheduled') && (
            <Button
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={() => handleProcessPayment(payroll.id)}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Process
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={() => setEditingPayroll(payroll)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-red-600 hover:bg-red-50"
            onClick={() => handleDelete(payroll.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      );
    }
  }
];