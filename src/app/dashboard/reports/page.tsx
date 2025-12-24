'use client';

import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, TrendingUp, Calendar, Filter, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select';
import { useForm } from 'react-hook-form';
import { Form } from '@/src/components/ui/form';
import { FormSelect } from '@/src/components/custom/formSelect';
import { StatCard } from '@/src/components/custom/statCard';

const monthlyData = [
  { month: 'Jan', deposits: 425000, withdrawals: 285000, net: 140000 },
  { month: 'Feb', deposits: 487000, withdrawals: 312000, net: 175000 },
  { month: 'Mar', deposits: 392000, withdrawals: 298000, net: 94000 },
  { month: 'Apr', deposits: 536000, withdrawals: 334000, net: 202000 },
  { month: 'May', deposits: 578000, withdrawals: 367000, net: 211000 },
  { month: 'Jun', deposits: 624000, withdrawals: 389000, net: 235000 },
];

const categoryData = [
  { category: 'Banking', value: 425000, growth: 12.5 },
  { category: 'Investments', value: 387000, growth: 8.3 },
  { category: 'Payments', value: 298000, growth: -3.2 },
  { category: 'Transfers', value: 234000, growth: 15.7 },
  { category: 'Loans', value: 189000, growth: 5.4 },
];

const performanceMetrics = [
  { metric: 'Average Transaction Value', value: '$2,847', change: '+8.2%', trend: 'up' },
  { metric: 'Transaction Success Rate', value: '96.7%', change: '+2.1%', trend: 'up' },
  { metric: 'Customer Acquisition Cost', value: '$124', change: '-5.3%', trend: 'down' },
  { metric: 'Monthly Active Users', value: '14,829', change: '+12.4%', trend: 'up' },
];

export default function Reports() {
  const form = useForm({ defaultValues: { range: '6months' } });
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl">Financial Reports & Analytics</h2>
          <p className="text-gray-600 mt-1">Comprehensive insights and performance metrics</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Date Range
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Average Transaction Value"
          value="$2,847"
          subtitle="+8.2% from last period"
          icon={TrendingUp}
          variant="emerald"
          size="medium"
        />
        <StatCard
          title="Transaction Success Rate"
          value="96.7%"
          subtitle="+2.1% from last period"
          icon={TrendingUp}
          variant="blue"
          size="medium"
        />
        <StatCard
          title="Customer Acquisition Cost"
          value="$124"
          subtitle="-5.3% from last period"
          icon={TrendingDown}
          variant="emerald"
          size="medium"
        />
        <StatCard
          title="Monthly Active Users"
          value="14,829"
          subtitle="+12.4% from last period"
          icon={TrendingUp}
          variant="purple"
          size="medium"
        />
      </div>

      {/* Monthly Performance Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Monthly Performance</CardTitle>
            <Form {...form}>
              <div className="w-[180px]">
                <FormSelect
                  control={form.control}
                  name="range"
                  label="Date Range"
                  options={[
                    { value: '6months', label: 'Last 6 Months' },
                    { value: '12months', label: 'Last 12 Months' },
                    { value: 'ytd', label: 'Year to Date' },
                  ]}
                />
              </div>
            </Form>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip />
              <Legend />
              <Bar dataKey="deposits" fill="#10b981" name="Deposits" />
              <Bar dataKey="withdrawals" fill="#ef4444" name="Withdrawals" />
              <Bar dataKey="net" fill="#3b82f6" name="Net Revenue" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Category Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Revenue */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" stroke="#888" />
                <YAxis dataKey="category" type="category" stroke="#888" width={100} />
                <Tooltip />
                <Bar dataKey="value" fill="#10b981" name="Revenue ($)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Growth */}
        <Card>
          <CardHeader>
            <CardTitle>Category Growth Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryData.map((item) => (
                <div key={item.category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm">{item.category}</p>
                    <p className="text-gray-600 text-xs mt-1">${item.value.toLocaleString()}</p>
                  </div>
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
                    item.growth >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                  }`}>
                    <TrendingUp className={`w-4 h-4 ${item.growth < 0 ? 'rotate-180' : ''}`} />
                    <span className="text-sm">{item.growth}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0">
          <CardContent className="pt-6">
            <p className="text-emerald-100">Total Revenue (6 months)</p>
            <p className="text-3xl mt-2">$3.04M</p>
            <p className="text-emerald-100 text-sm mt-2">+18.3% from previous period</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
          <CardContent className="pt-6">
            <p className="text-blue-100">Total Transactions</p>
            <p className="text-3xl mt-2">89,547</p>
            <p className="text-blue-100 text-sm mt-2">+23.1% from previous period</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
          <CardContent className="pt-6">
            <p className="text-purple-100">Average Order Value</p>
            <p className="text-3xl mt-2">$2,847</p>
            <p className="text-purple-100 text-sm mt-2">+8.2% from previous period</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}