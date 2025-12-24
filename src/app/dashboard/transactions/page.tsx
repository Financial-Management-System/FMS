'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Filter, Download, TrendingUp, AlertCircle, Clock, DollarSign } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Card, CardContent } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select';
import { FormSelect } from '@/src/components/custom/formSelect';
import { Form } from '@/src/components/ui/form';
import { PageHeader } from '@/src/components/custom/pageHeader';
import { StatsCard } from '@/src/components/custom/statsCard';
import { StatCard } from '@/src/components/custom/statCard';
import { SearchBar } from '@/src/components/custom/searchBar';
import { StatusBadge } from '@/src/components/custom/StatusBadge';
import { DataTable } from '@/src/components/custom/DataTable';
import { Transaction } from '@/src/types';

// Generate deterministic transactions for pagination demo (seeded RNG to avoid SSR/client mismatch)
const generateTransactions = (): Transaction[] => {
  const users = [
    { name: 'John Smith', email: 'john@example.com' },
    { name: 'Sarah Johnson', email: 'sarah@example.com' },
    { name: 'Mike Brown', email: 'mike@example.com' },
    { name: 'Emma Davis', email: 'emma@example.com' },
    { name: 'Alex Wilson', email: 'alex@example.com' },
    { name: 'Lisa Anderson', email: 'lisa@example.com' },
    { name: 'David Martinez', email: 'david@example.com' },
    { name: 'Jennifer Lee', email: 'jennifer@example.com' },
    { name: 'Robert Taylor', email: 'robert@example.com' },
    { name: 'Patricia White', email: 'patricia@example.com' },
  ];

  const types: Transaction['type'][] = ['Deposit', 'Withdrawal', 'Transfer', 'Payment'];
  const statuses: Transaction['status'][] = ['Completed', 'Pending', 'Failed'];
  const methods = ['Bank Transfer', 'Wire Transfer', 'Credit Card', 'Debit Card', 'Internal Transfer'];

  // simple LCG seeded RNG to keep values stable between server and client
  const createSeededRandom = (seed: number) => {
    let s = seed >>> 0;
    return () => {
      // constants from Numerical Recipes
      s = (s * 1664525 + 1013904223) % 0x100000000;
      return s / 0x100000000;
    };
  };

  const rand = createSeededRandom(123456);

  const transactions: Transaction[] = [];
  for (let i = 1; i <= 50; i++) {
    const user = users[Math.floor(rand() * users.length)];
    const type = types[Math.floor(rand() * types.length)];
    const status = statuses[Math.floor(rand() * statuses.length)];
    const method = methods[Math.floor(rand() * methods.length)];
    const isNegative = type === 'Withdrawal' || type === 'Payment';
    const amount = (rand() * 10000 + 100) * (isNegative ? -1 : 1);

    const day = String(Math.floor(rand() * 14) + 1).padStart(2, '0');
    const hour = String(Math.floor(rand() * 24)).padStart(2, '0');
    const minute = String(Math.floor(rand() * 60)).padStart(2, '0');

    transactions.push({
      id: `TXN${String(i).padStart(3, '0')}`,
      user: user.name,
      email: user.email,
      amount: Math.round(amount),
      type,
      status,
      date: `2025-12-${day} ${hour}:${minute}`,
      method,
    });
  }
  return transactions;
};

const allTransactions = generateTransactions();

// Column definitions
export const transactionColumns: ColumnDef<Transaction>[] = [
  {
    accessorKey: 'id',
    header: 'Transaction ID',
    cell: ({ row }) => (
      <span className="text-emerald-600">{row.getValue('id')}</span>
    ),
  },
  {
    accessorKey: 'user',
    header: 'User Details',
    cell: ({ row }) => (
      <div>
        <p>{row.getValue('user')}</p>
        <p className="text-sm text-gray-500">{row.original.email}</p>
      </div>
    ),
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
    accessorKey: 'method',
    header: 'Method',
    cell: ({ row }) => (
      <span className="text-gray-600 text-sm">{row.getValue('method')}</span>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <StatusBadge status={row.getValue('status')} />,
  },
  {
    accessorKey: 'date',
    header: 'Date & Time',
    cell: ({ row }) => (
      <span className="text-gray-600 text-sm">{row.getValue('date')}</span>
    ),
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: () => (
      <Button variant="link" className="text-emerald-600 hover:text-emerald-700 p-0">
        View Details
      </Button>
    ),
  },
];

export default function Transactions() {
  const [searchTerm, setSearchTerm] = useState('');
  const form = useForm({
    defaultValues: { status: 'All', type: 'All' },
  });
  const { watch } = form;
  const statusFilter = watch('status');
  const typeFilter = watch('type');

  const filteredTransactions = allTransactions.filter((transaction) => {
    const matchesSearch =
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || transaction.status === statusFilter;
    const matchesType = typeFilter === 'All' || transaction.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const totalAmount = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);
  const pendingCount = filteredTransactions.filter(t => t.status === 'Pending').length;
  const failedCount = filteredTransactions.filter(t => t.status === 'Failed').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Transaction Management"
        description="Monitor and manage all financial transactions"
        actionLabel="Export Data"
        actionIcon={Download}
        onAction={() => console.log('Export data')}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard
          title="Total Transactions"
          value={filteredTransactions.length}
          icon={TrendingUp}
          variant="emerald"
          size="medium"
        />
        <StatCard
          title="Net Amount"
          value={`$${Math.abs(totalAmount).toLocaleString()}`}
          icon={DollarSign}
          variant={totalAmount >= 0 ? 'emerald' : 'red'}
          size="medium"
        />
        <StatCard
          title="Pending"
          value={pendingCount}
          icon={Clock}
          variant="yellow"
          size="medium"
        />
        <StatCard
          title="Failed"
          value={failedCount}
          icon={AlertCircle}
          variant="red"
          size="medium"
        />
      </div>

      {/* Filters */}
      <Form {...form}>
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col lg:flex-row gap-4">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search by ID, user, or email..."
              className=''
            />

            {/* Status Filter (FormSelect) */}
            <div className="w-full lg:w-[180px]">
              <FormSelect
                control={form.control}
                name="status"
                label="Status :"
                options={[
                  { value: 'All', label: 'All Statuses' },
                  { value: 'Completed', label: 'Completed' },
                  { value: 'Pending', label: 'Pending' },
                  { value: 'Failed', label: 'Failed' },
                ]}
                className='flex'
              />
            </div>

            {/* Type Filter (FormSelect) */}
            <div className="w-full lg:w-[180px]">
              <FormSelect
                control={form.control}
                name="type"
                label="Type :"
                options={[
                  { value: 'All', label: 'All Types' },
                  { value: 'Deposit', label: 'Deposit' },
                  { value: 'Withdrawal', label: 'Withdrawal' },
                  { value: 'Transfer', label: 'Transfer' },
                  { value: 'Payment', label: 'Payment' },
                ]}
                className='flex'
              />
            </div>

            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
            
          </CardContent>
        </Card>
      </Form>

      {/* Transactions Table */}
      <Card>
        <CardContent className="pt-6">
          <DataTable
            columns={transactionColumns}
            data={filteredTransactions}
            emptyMessage="No transactions found"
          />
        </CardContent>
      </Card>
    </div>
  );
}