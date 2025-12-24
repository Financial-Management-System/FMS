'use client';

import { Card } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { FileText, Download, Calendar, TrendingUp, DollarSign, Users, PieChart } from 'lucide-react';

const reportTypes = [
  { id: 1, name: 'Financial Summary Report', description: 'Comprehensive overview of all financial activities', icon: DollarSign, color: 'emerald' },
  { id: 2, name: 'Budget vs Actual Report', description: 'Compare budgeted amounts with actual spending', icon: PieChart, color: 'blue' },
  { id: 3, name: 'Department Performance', description: 'Detailed performance metrics by department', icon: TrendingUp, color: 'purple' },
  { id: 4, name: 'Payroll Report', description: 'Employee compensation and payroll summary', icon: Users, color: 'orange' },
  { id: 5, name: 'Expense Analysis', description: 'Detailed breakdown of expenses by category', icon: FileText, color: 'pink' },
  { id: 6, name: 'Income Statement', description: 'Revenue and expense statement for the period', icon: TrendingUp, color: 'cyan' },
];

const recentReports = [
  { id: 1, name: 'Q4 2024 Financial Summary', generatedBy: 'John Smith', date: '2025-12-10', size: '2.4 MB' },
  { id: 2, name: 'November Payroll Report', generatedBy: 'HR Team', date: '2025-12-05', size: '1.8 MB' },
  { id: 3, name: 'Department Budget Analysis', generatedBy: 'Finance Team', date: '2025-12-01', size: '3.1 MB' },
];

export default function OrgReports() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl text-gray-900">Reports</h2>
        <p className="mt-1 text-gray-600">Generate comprehensive financial reports</p>
      </div>

      {/* Report Types */}
      <div>
        <h3 className="mb-4 text-lg text-gray-900">Available Reports</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reportTypes.map((report) => {
            const Icon = report.icon;
            const bgColor = `bg-${report.color}-100`;
            const textColor = `text-${report.color}-600`;
            
            return (
              <Card key={report.id} className="p-6 transition-shadow cursor-pointer hover:shadow-md">
                <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 ${textColor}`} />
                </div>
                <h4 className="mb-2 text-gray-900">{report.name}</h4>
                <p className="mb-4 text-sm text-gray-600">{report.description}</p>
                <Button size="sm" variant="outline" className="w-full">
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Custom Report */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg text-gray-900">Generate Custom Report</h3>
        <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-3">
          <div>
            <label className="block mb-2 text-sm text-gray-600">Report Type</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
              <option>Financial Summary</option>
              <option>Budget Analysis</option>
              <option>Expense Report</option>
            </select>
          </div>
          <div>
            <label className="block mb-2 text-sm text-gray-600">Date Range</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
              <option>Last Month</option>
              <option>Last Quarter</option>
              <option>Last Year</option>
              <option>Custom Range</option>
            </select>
          </div>
          <div>
            <label className="block mb-2 text-sm text-gray-600">Format</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
              <option>PDF</option>
              <option>Excel</option>
              <option>CSV</option>
            </select>
          </div>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          <Calendar className="w-4 h-4 mr-2" />
          Generate Custom Report
        </Button>
      </Card>

      {/* Recent Reports */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg text-gray-900">Recently Generated Reports</h3>
        <div className="space-y-3">
          {recentReports.map((report) => (
            <div key={report.id} className="flex items-center justify-between p-4 transition-colors rounded-lg bg-gray-50 hover:bg-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-100">
                  <FileText className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-900">{report.name}</p>
                  <p className="text-xs text-gray-500">Generated by {report.generatedBy} on {report.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500">{report.size}</span>
                <Button size="sm" variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
