'use client';

import { Card } from '@/src/components/ui/card';
import { BarChart3, TrendingUp, TrendingDown, AlertTriangle, DollarSign, Calendar, Building } from 'lucide-react';

const budgetData = [
  { department: 'Engineering', allocated: 250000, spent: 185000, forecasted: 240000 },
  { department: 'Marketing', allocated: 150000, spent: 142000, forecasted: 155000 },
  { department: 'Sales', allocated: 180000, spent: 165000, forecasted: 178000 },
  { department: 'Operations', allocated: 120000, spent: 95000, forecasted: 110000 },
  { department: 'HR', allocated: 80000, spent: 72000, forecasted: 79000 },
];

const alerts = [
  { id: 1, type: 'warning', message: 'Marketing budget at 94.7% utilization', department: 'Marketing' },
  { id: 2, type: 'danger', message: 'Sales exceeded monthly budget by $6,000', department: 'Sales' },
  { id: 3, type: 'info', message: 'Engineering on track with 74% utilization', department: 'Engineering' },
];

export default function OrgBudgetMonitoring() {
  const totalAllocated = budgetData.reduce((sum, d) => sum + d.allocated, 0);
  const totalSpent = budgetData.reduce((sum, d) => sum + d.spent, 0);
  const totalForecasted = budgetData.reduce((sum, d) => sum + d.forecasted, 0);
  const utilizationRate = (totalSpent / totalAllocated) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl text-gray-900">Budget Monitoring</h2>
        <p className="mt-1 text-gray-600">Monitor budget performance and alerts in real-time</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Allocated</p>
              <p className="mt-1 text-2xl">${totalAllocated.toLocaleString()}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Spent</p>
              <p className="mt-1 text-2xl">${totalSpent.toLocaleString()}</p>
            </div>
            <div className="p-2 rounded-lg bg-emerald-100">
              <TrendingDown className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600">Forecasted</p>
              <p className="mt-1 text-2xl">${totalForecasted.toLocaleString()}</p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600">Utilization Rate</p>
              <p className="mt-1 text-2xl">{utilizationRate.toFixed(1)}%</p>
            </div>
            <div className="p-2 bg-orange-100 rounded-lg">
              <BarChart3 className="w-5 h-5 text-orange-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Alerts */}
      <Card className="p-6">
        <h3 className="flex items-center gap-2 mb-4 text-lg text-gray-900">
          <AlertTriangle className="w-5 h-5 text-orange-600" />
          Budget Alerts
        </h3>
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-lg flex items-start gap-3 ${
                alert.type === 'danger' ? 'bg-red-50' :
                alert.type === 'warning' ? 'bg-yellow-50' :
                'bg-blue-50'
              }`}
            >
              <AlertTriangle className={`w-5 h-5 mt-0.5 ${
                alert.type === 'danger' ? 'text-red-600' :
                alert.type === 'warning' ? 'text-yellow-600' :
                'text-blue-600'
              }`} />
              <div className="flex-1">
                <p className="text-sm text-gray-900">{alert.message}</p>
                <p className="mt-1 text-xs text-gray-500">{alert.department} Department</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Department Budget Performance */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg text-gray-900">Department Budget Performance</h3>
        <div className="space-y-6">
          {budgetData.map((dept) => {
            const utilization = (dept.spent / dept.allocated) * 100;
            const variance = dept.forecasted - dept.allocated;
            
            return (
              <div key={dept.department}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{dept.department}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-600">
                      ${dept.spent.toLocaleString()} / ${dept.allocated.toLocaleString()}
                    </span>
                    <span className={`${utilization > 90 ? 'text-red-600' : 'text-emerald-600'}`}>
                      {utilization.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div
                    className={`h-2 rounded-full ${
                      utilization > 100 ? 'bg-red-500' :
                      utilization > 90 ? 'bg-yellow-500' :
                      'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(utilization, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <p className="text-xs text-gray-500">
                    Forecasted: ${dept.forecasted.toLocaleString()}
                  </p>
                  <p className={`text-xs ${variance >= 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                    {variance >= 0 ? '+' : ''}{variance.toLocaleString()} variance
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Monthly Trend */}
      <Card className="p-6">
        <h3 className="flex items-center gap-2 mb-4 text-lg text-gray-900">
          <Calendar className="w-5 h-5 text-gray-600" />
          Monthly Spending Trend
        </h3>
        <div className="flex items-end justify-between h-64 gap-2">
          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, idx) => {
            const height = Math.random() * 80 + 20;
            return (
              <div key={month} className="flex flex-col items-center flex-1">
                <div
                  className="w-full transition-colors rounded-t cursor-pointer bg-emerald-500 hover:bg-emerald-600"
                  style={{ height: `${height}%` }}
                />
                <p className="mt-2 text-xs text-gray-600">{month}</p>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
