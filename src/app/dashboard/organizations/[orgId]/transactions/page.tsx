"use client";

import { use, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Filter, Download, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { DataTable } from '@/src/components/dataTable/dataTable';
import { SearchBar } from '@/src/components/custom/searchBar';
import { StandaloneSelect } from '@/src/components/custom/standaloneSelect';
import { SectionCard } from '@/src/components/custom/sectionCard';
import { OrgTransaction, orgTransactionColumns } from './columns';

export default function OrgTransactions({ params }: { params: Promise<{ orgId: string }> }) {
  const resolvedParams = use(params);
  const [transactions, setTransactions] = useState<OrgTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const [incomeRes, expenseRes] = await Promise.all([
        fetch(`/api/income?organizationId=${resolvedParams.orgId}`),
        fetch(`/api/expense?organizationId=${resolvedParams.orgId}`)
      ]);

      const incomeData = await incomeRes.json();
      const expenseData = await expenseRes.json();

      const allTransactions: OrgTransaction[] = [];

      if (incomeData.success) {
        const incomes = incomeData.data.map((item: any) => ({
          id: item._id,
          date: item.date ? new Date(item.date).toISOString().split('T')[0] : '',
          description: item.title || item.source || 'Income',
          amount: item.amount,
          type: 'Income',
          status: item.status || 'Completed',
          category: item.category || 'General'
        }));
        allTransactions.push(...incomes);
      }

      if (expenseData.success) {
        const expenses = expenseData.data.map((item: any) => ({
          id: item._id,
          date: item.date ? new Date(item.date).toISOString().split('T')[0] : '',
          description: item.title || item.description || 'Expense',
          amount: -Math.abs(item.amount),
          type: 'Expense',
          status: item.status || 'Completed',
          category: item.category || 'General'
        }));
        allTransactions.push(...expenses);
      }

      allTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setTransactions(allTransactions);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || transaction.type === filterType;
    const matchesStatus = filterStatus === 'All' || transaction.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const totalIncome = transactions.filter(t => t.type === 'Income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = Math.abs(transactions.filter(t => t.type === 'Expense').reduce((sum, t) => sum + t.amount, 0));
  const netBalance = totalIncome - totalExpense;

  if (loading) {
    return <div className="p-6">Loading transactions...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Income</p>
              <p className="mt-1 text-2xl font-semibold text-emerald-600">${totalIncome.toLocaleString()}</p>
              <p className="mt-1 text-xs text-gray-500">{transactions.filter(t => t.type === 'Income').length} transactions</p>
            </div>
            <div className="p-2 rounded-lg bg-emerald-100">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Expenses</p>
              <p className="mt-1 text-2xl font-semibold text-red-600">${totalExpense.toLocaleString()}</p>
              <p className="mt-1 text-xs text-gray-500">{transactions.filter(t => t.type === 'Expense').length} transactions</p>
            </div>
            <div className="p-2 bg-red-100 rounded-lg">
              <TrendingDown className="w-5 h-5 text-red-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600">Net Balance</p>
              <p className={`mt-1 text-2xl font-semibold ${netBalance >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                ${netBalance.toLocaleString()}
              </p>
              <p className="mt-1 text-xs text-gray-500">Current period</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-blue-600" />
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
            placeholder="Search transactions..."
            className="md:flex-1"
          />
          
          <div className="flex gap-2 flex-wrap">
            <StandaloneSelect
              value={filterType}
              onValueChange={setFilterType}
              placeholder="All Types"
              options={[
                { value: 'All', label: 'All Types' },
                { value: 'Income', label: 'Income' },
                { value: 'Expense', label: 'Expense' },
              ]}
              className="w-[140px]"
            />
            
            <StandaloneSelect
              value={filterStatus}
              onValueChange={setFilterStatus}
              placeholder="All Status"
              options={[
                { value: 'All', label: 'All Status' },
                { value: 'Completed', label: 'Completed' },
                { value: 'Pending', label: 'Pending' },
              ]}
              className="w-[140px]"
            />
            
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </Card>

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
