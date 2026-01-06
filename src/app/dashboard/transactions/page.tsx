'use client';

import { useState } from 'react';
import { Filter, Download, TrendingUp, AlertCircle, Clock, DollarSign } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/src/components/ui/button';
import { PageHeader } from '@/src/components/custom/pageHeader';
import { StatusBadge } from '@/src/components/custom/StatusBadge';
import { DataTable } from '@/src/components/dataTable/dataTable';
import { DataTableFilter } from '@/src/components/dataTable/dataTableFilter';
import { Transaction } from '@/src/types';
import { SectionCard } from '@/src/components/custom/sectionCard';
import { StatCard } from '@/src/components/custom/statCard';
import { StandaloneSelect } from '@/src/components/custom/standaloneSelect';


// Generate more transactions for pagination demo
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

  const types = ['Deposit', 'Withdrawal', 'Transfer', 'Payment'] as const;
  const statuses = ['Completed', 'Pending', 'Failed'] as const;
  const methods = ['Bank Transfer', 'Wire Transfer', 'Credit Card', 'Debit Card', 'Internal Transfer'];

  const transactions: Transaction[] = [];
  for (let i = 1; i <= 50; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const type = types[Math.floor(Math.random() * types.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const method = methods[Math.floor(Math.random() * methods.length)];
    const isNegative = type === 'Withdrawal' || type === 'Payment';
    const amount = (Math.random() * 10000 + 100) * (isNegative ? -1 : 1);

    transactions.push({
      id: `TXN${String(i).padStart(3, '0')}`,
      user: user.name,
      email: user.email,
      amount: Math.round(amount),
      type,
      status,
      date: `2025-12-${String(Math.floor(Math.random() * 14) + 1).padStart(2, '0')} ${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
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
    filterFn: (row, id, value) => {
      const searchValue = value.toLowerCase();
      return (
        row.getValue(id).toString().toLowerCase().includes(searchValue) ||
        row.original.user.toLowerCase().includes(searchValue) ||
        row.original.email.toLowerCase().includes(searchValue)
      );
    },
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
  const [table, setTable] = useState<any>(null);

  const getFilteredData = () => {
    if (!table) return allTransactions;
    return table.getFilteredRowModel().rows.map((row: any) => row.original);
  };

  const filteredTransactions = getFilteredData();
  const totalAmount = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);
  const pendingCount = filteredTransactions.filter(t => t.status === 'Pending').length;
  const failedCount = filteredTransactions.filter(t => t.status === 'Failed').length;

  const toolbar = (tableInstance: any) => (
    <div className="flex flex-col lg:flex-row gap-4">
      <DataTableFilter
        table={tableInstance}
        columnKey="id"
        placeholder="Search by ID, user, or email..."
        className="max-w-sm"
      />
      <StandaloneSelect
        value={(tableInstance.getColumn('status')?.getFilterValue() as string) ?? 'All'}
        onValueChange={(value) => 
          tableInstance.getColumn('status')?.setFilterValue(value === 'All' ? '' : value)
        }
        placeholder="All Statuses"
        options={[
          { value: 'All', label: 'All Statuses' },
          { value: 'Completed', label: 'Completed' },
          { value: 'Pending', label: 'Pending' },
          { value: 'Failed', label: 'Failed' },
        ]}
      />
      <StandaloneSelect
        value={(tableInstance.getColumn('type')?.getFilterValue() as string) ?? 'All'}
        onValueChange={(value) => 
          tableInstance.getColumn('type')?.setFilterValue(value === 'All' ? '' : value)
        }
        placeholder="All Types"
        options={[
          { value: 'All', label: 'All Types' },
          { value: 'Deposit', label: 'Deposit' },
          { value: 'Withdrawal', label: 'Withdrawal' },
          { value: 'Transfer', label: 'Transfer' },
          { value: 'Payment', label: 'Payment' },
        ]}
      />
      <Button variant="outline">
        <Filter className="w-4 h-4 mr-2" />
        More Filters
      </Button>
    </div>
  );

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



      {/* Transactions Table */}
      <SectionCard title="All Transactions">
        <DataTable
          columns={transactionColumns}
          data={allTransactions}
          toolbar={toolbar}
          getTableInstance={setTable}
          showPagination={true}
          paginationOptions={{
            pageSizeOptions: [10, 20, 30, 50],
            showRowsPerPage: true,
            showFirstLastButtons: true,
            showPageInfo: true,
            showSelectedRows: false,
          }}
        />
      </SectionCard>
    </div>
  );
}