'use client';

import { TrendingUp, TrendingDown, DollarSign, Users, CreditCard, Activity } from 'lucide-react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ColumnDef } from '@tanstack/react-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { DataTable } from '@/src/components/dataTable/dataTable';
import { StatusBadge } from '@/src/components/custom/StatusBadge';
import { Transaction } from '@/src/types';
import { use } from 'react';
import { SectionCard } from '@/src/components/custom/sectionCard';
import { StatCard } from '@/src/components/custom/statCard';

const stats = [
  {
    name: 'Total Revenue',
    value: '$2,847,392',
    change: '+12.5%',
    trend: 'up',
    icon: DollarSign,
    color: 'emerald',
  },
  {
    name: 'Active Users',
    value: '14,829',
    change: '+8.2%',
    trend: 'up',
    icon: Users,
    color: 'blue',
  },
  {
    name: 'Transactions',
    value: '89,547',
    change: '+23.1%',
    trend: 'up',
    icon: CreditCard,
    color: 'purple',
  },
  {
    name: 'Processing Volume',
    value: '$12.4M',
    change: '-3.2%',
    trend: 'down',
    icon: Activity,
    color: 'orange',
  },
];

const revenueData = [
  { month: 'Jan', revenue: 185000, expenses: 125000 },
  { month: 'Feb', revenue: 238000, expenses: 142000 },
  { month: 'Mar', revenue: 195000, expenses: 138000 },
  { month: 'Apr', revenue: 267000, expenses: 155000 },
  { month: 'May', revenue: 289000, expenses: 168000 },
  { month: 'Jun', revenue: 312000, expenses: 175000 },
];

const transactionTypes = [
  { name: 'Deposits', value: 4200, color: '#10b981' },
  { name: 'Withdrawals', value: 3100, color: '#f59e0b' },
  { name: 'Transfers', value: 2800, color: '#3b82f6' },
  { name: 'Payments', value: 1900, color: '#8b5cf6' },
];

const recentTransactions: Transaction[] = [
  { id: 'TXN001', user: 'John Smith', email: 'john@example.com', amount: 2500, type: 'Deposit', status: 'Completed', date: '2025-12-12', method: 'Bank Transfer' },
  { id: 'TXN002', user: 'Sarah Johnson', email: 'sarah@example.com', amount: -1200, type: 'Withdrawal', status: 'Completed', date: '2025-12-12', method: 'Wire Transfer' },
  { id: 'TXN003', user: 'Mike Brown', email: 'mike@example.com', amount: 5000, type: 'Transfer', status: 'Pending', date: '2025-12-12', method: 'Internal Transfer' },
  { id: 'TXN004', user: 'Emma Davis', email: 'emma@example.com', amount: -850, type: 'Payment', status: 'Completed', date: '2025-12-11', method: 'Credit Card' },
  { id: 'TXN005', user: 'Alex Wilson', email: 'alex@example.com', amount: 3200, type: 'Deposit', status: 'Completed', date: '2025-12-11', method: 'Debit Card' },
];

// Column definitions for recent transactions table
const recentTransactionColumns: ColumnDef<Transaction>[] = [
  {
    accessorKey: 'id',
    header: 'Transaction ID',
  },
  {
    accessorKey: 'user',
    header: 'User',
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => {
      const amount = row.getValue('amount') as number;
      return (
        <span className={amount > 0 ? 'text-emerald-600' : 'text-red-600'}>
          {amount > 0 ? '+' : ''}${Math.abs(amount).toLocaleString()}
        </span>
      );
    },
  },
  {
    accessorKey: 'type',
    header: 'Type',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <StatusBadge status={row.getValue('status')} />,
  },
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => (
      <span className="text-gray-600 text-sm">{row.getValue('date')}</span>
    ),
  },
];

export default function Overview() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StatCard
            key={stat.name}
            title={stat.name}
            value={stat.value}
            icon={stat.icon}
            variant={stat.color as 'emerald' | 'blue' | 'purple' | 'orange'}
            trend={stat.trend as 'up' | 'down'}
            change={stat.change}
            size="medium"
          />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <SectionCard title="Revenue vs Expenses">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} name="Revenue" />
              <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} name="Expenses" />
            </LineChart>
          </ResponsiveContainer>
        </SectionCard>

        {/* Transaction Types Chart */}
        <SectionCard title="Transaction Types Distribution">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={transactionTypes}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {transactionTypes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      {/* Recent Transactions */}
      <SectionCard title="Recent Transactions">
        <DataTable
          columns={recentTransactionColumns}
          data={recentTransactions}
          showPagination={false}
        />
      </SectionCard>
    </div>
  );
}