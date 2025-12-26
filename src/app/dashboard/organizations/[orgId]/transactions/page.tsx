"use client";

import { use, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Filter, Download } from 'lucide-react';
import { DataTable } from '@/src/components/dataTable/dataTable';
import { SearchBar } from '@/src/components/custom/searchBar';
import { StandaloneSelect } from '@/src/components/custom/standaloneSelect';
import { SectionCard } from '@/src/components/custom/sectionCard';
import { OrgTransaction, orgTransactionColumns } from './columns';

const transactions: OrgTransaction[] = [
  { id: 'TXN-001', date: '2024-12-14', description: 'Client Payment - Project Alpha', amount: 15000, type: 'Income', status: 'Completed', category: 'Sales' },
  { id: 'TXN-002', date: '2024-12-13', description: 'Office Rent Payment', amount: -3500, type: 'Expense', status: 'Completed', category: 'Operations' },
  { id: 'TXN-003', date: '2024-12-13', description: 'Subscription Revenue', amount: 2400, type: 'Income', status: 'Completed', category: 'Recurring' },
  { id: 'TXN-004', date: '2024-12-12', description: 'Marketing Campaign', amount: -1200, type: 'Expense', status: 'Completed', category: 'Marketing' },
  { id: 'TXN-005', date: '2024-12-12', description: 'Consulting Services', amount: 8500, type: 'Income', status: 'Pending', category: 'Services' },
  { id: 'TXN-006', date: '2024-12-11', description: 'Software License', amount: -899, type: 'Expense', status: 'Completed', category: 'Technology' },
  { id: 'TXN-007', date: '2024-12-11', description: 'Product Sales', amount: 4200, type: 'Income', status: 'Completed', category: 'Sales' },
  { id: 'TXN-008', date: '2024-12-10', description: 'Employee Salaries', amount: -25000, type: 'Expense', status: 'Completed', category: 'Payroll' },
];


export default function OrgTransactions() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTransactions = transactions.filter((transaction) =>
    transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search transactions..."
          className="w-full sm:max-w-md"
        />
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Transactions Table */}
      <SectionCard title="All Transactions">
        <DataTable
          columns={orgTransactionColumns}
          data={filteredTransactions}
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
