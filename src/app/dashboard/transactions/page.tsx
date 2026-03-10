'use client';

import { useState, useEffect } from 'react';
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
        row.original.user?.toLowerCase().includes(searchValue) ||
        row.original.email?.toLowerCase().includes(searchValue) ||
        row.original.company?.toLowerCase().includes(searchValue)
      );
    },
  },
  {
    accessorKey: 'company',
    header: 'Company',
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue('company') || 'N/A'}</span>
    ),
  },
  {
    accessorKey: 'user',
    header: 'User Details',
    cell: ({ row }) => (
      <div>
        <p>{row.getValue('user') || 'Unknown User'}</p>
        <p className="text-sm text-gray-500">{row.original.email}</p>
      </div>
    ),
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => {
      const amount = row.getValue('amount') as number;
      const type = row.original.type;
      const isNegative = type === 'expense' || type === 'Withdrawal' || type === 'Payment';

      return (
        <span className={!isNegative ? 'text-emerald-600' : 'text-red-600'}>
          {!isNegative ? '+' : ''}{isNegative ? '-' : ''}${Math.abs(amount).toLocaleString()}
        </span>
      );
    },
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
      <span className="text-gray-600 text-sm">
        {new Date(row.getValue('date')).toLocaleString()}
      </span>
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
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/transactions');
      const result = await response.json();
      if (result.success) {
        setAllTransactions(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredData = () => {
    if (!table) return allTransactions;
    return table.getFilteredRowModel().rows.map((row: any) => row.original);
  };

  const filteredTransactions = getFilteredData();
  const totalAmount = filteredTransactions.reduce((sum, t) => sum + (t.amount || 0), 0);
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