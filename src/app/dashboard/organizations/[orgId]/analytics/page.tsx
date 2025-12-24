import { Card } from '@/src/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';

const metrics = [
  { label: 'Revenue', value: '$1.2M', change: '+12.5%', trend: 'up' },
  { label: 'Expenses', value: '$850K', change: '+8.2%', trend: 'up' },
  { label: 'Net Profit', value: '$350K', change: '+18.3%', trend: 'up' },
  { label: 'Operating Margin', value: '29.2%', change: '+3.1%', trend: 'up' },
];

const departmentSpending = [
  { name: 'Engineering', amount: 285000, percentage: 33.5 },
  { name: 'Marketing', amount: 195000, percentage: 22.9 },
  { name: 'Sales', amount: 165000, percentage: 19.4 },
  { name: 'Operations', amount: 135000, percentage: 15.9 },
  { name: 'HR', amount: 70000, percentage: 8.2 },
];

const monthlyData = [
  { month: 'Jan', revenue: 95000, expenses: 68000 },
  { month: 'Feb', revenue: 102000, expenses: 71000 },
  { month: 'Mar', revenue: 108000, expenses: 75000 },
  { month: 'Apr', revenue: 98000, expenses: 69000 },
  { month: 'May', revenue: 115000, expenses: 78000 },
  { month: 'Jun', revenue: 122000, expenses: 82000 },
];

export default function OrgAnalytics() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl text-gray-900">Analytics Dashboard</h2>
        <p className="mt-1 text-gray-600">Advanced analytics and financial insights</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.label} className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600">{metric.label}</p>
                <p className="mt-1 text-2xl">{metric.value}</p>
                <div className={`flex items-center gap-1 mt-2 text-sm ${
                  metric.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
                }`}>
                  {metric.trend === 'up' ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  <span>{metric.change}</span>
                </div>
              </div>
              <div className={`p-2 rounded-lg ${
                metric.trend === 'up' ? 'bg-emerald-100' : 'bg-red-100'
              }`}>
                {metric.trend === 'up' ? (
                  <TrendingUp className={`w-5 h-5 text-emerald-600`} />
                ) : (
                  <TrendingDown className={`w-5 h-5 text-red-600`} />
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Revenue vs Expenses Chart */}
      <Card className="p-6">
        <h3 className="flex items-center gap-2 mb-6 text-lg text-gray-900">
          <Activity className="w-5 h-5 text-gray-600" />
          Revenue vs Expenses Trend
        </h3>
        <div className="flex items-end justify-between h-64 gap-4">
          {monthlyData.map((data) => {
            const maxValue = 130000;
            const revenueHeight = (data.revenue / maxValue) * 100;
            const expenseHeight = (data.expenses / maxValue) * 100;
            
            return (
              <div key={data.month} className="flex flex-col items-center flex-1 gap-2">
                <div className="flex items-end w-full h-48 gap-1">
                  <div
                    className="flex-1 transition-colors rounded-t cursor-pointer bg-emerald-500 hover:bg-emerald-600"
                    style={{ height: `${revenueHeight}%` }}
                    title={`Revenue: $${data.revenue.toLocaleString()}`}
                  />
                  <div
                    className="flex-1 transition-colors bg-red-400 rounded-t cursor-pointer hover:bg-red-500"
                    style={{ height: `${expenseHeight}%` }}
                    title={`Expenses: $${data.expenses.toLocaleString()}`}
                  />
                </div>
                <p className="text-xs text-gray-600">{data.month}</p>
              </div>
            );
          })}
        </div>
        <div className="flex justify-center gap-6 mt-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-emerald-500" />
            <span className="text-sm text-gray-600">Revenue</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-400 rounded" />
            <span className="text-sm text-gray-600">Expenses</span>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Department Spending */}
        <Card className="p-6">
          <h3 className="flex items-center gap-2 mb-4 text-lg text-gray-900">
            <DollarSign className="w-5 h-5 text-gray-600" />
            Department Spending Breakdown
          </h3>
          <div className="space-y-4">
            {departmentSpending.map((dept) => (
              <div key={dept.name}>
                <div className="flex justify-between mb-2 text-sm">
                  <span className="text-gray-700">{dept.name}</span>
                  <span className="text-gray-900">${dept.amount.toLocaleString()}</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-2 rounded-full bg-emerald-500"
                    style={{ width: `${dept.percentage}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">{dept.percentage}% of total</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Insights */}
        <Card className="p-6">
          <h3 className="mb-4 text-lg text-gray-900">Key Insights</h3>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-emerald-50">
              <p className="text-sm text-emerald-800">
                <strong>Revenue Growth:</strong> Revenue increased by 12.5% compared to last quarter, driven by strong sales performance.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-blue-50">
              <p className="text-sm text-blue-800">
                <strong>Cost Efficiency:</strong> Operating expenses remained stable while revenue grew, improving profit margins.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-purple-50">
              <p className="text-sm text-purple-800">
                <strong>Department Performance:</strong> Engineering department leading in budget utilization and project delivery.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-orange-50">
              <p className="text-sm text-orange-800">
                <strong>Forecast:</strong> Based on current trends, expect 15% revenue growth next quarter.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
