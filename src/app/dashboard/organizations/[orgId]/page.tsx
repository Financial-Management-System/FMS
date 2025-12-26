'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Bell,
  Building2,
  Settings,
  FolderKanban,
  Users,
  Shield,
  ArrowLeftRight, 
  TrendingUp,
  TrendingDown,
  DollarSign,
  Repeat,
  CheckSquare,
  AlertCircle,
  PieChart,
  FileText,
  BarChart3,
  ClipboardList,
  Coins,
  User,
  HelpCircle,
  LogOut,
  ChevronLeft,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend 
} from 'recharts';
import { initialCompanies } from '../page';
import { StatCard } from '@/src/components/custom';
import { SectionCard } from '@/src/components/custom/sectionCard';


interface SidebarSection {
  title: string;
  items: SidebarItem[];
}

interface SidebarItem {
  name: string;
  href: string;
  icon: any;
}

export const sidebarSections: SidebarSection[] = [
  {
    title: 'Core',
    items: [
      { name: 'Dashboard', href: '', icon: LayoutDashboard },
      { name: 'Notifications', href: 'notifications', icon: Bell },
      { name: 'Organization Management', href: 'organizationManagement', icon: Building2 },
      { name: 'Organization Settings', href: 'orgSettings', icon: Settings },
      { name: 'Departments / Projects', href: 'departments', icon: FolderKanban },
      { name: 'Users Management', href: 'users', icon: Users },
      { name: 'Roles & Permissions', href: 'roles', icon: Shield },
    ],
  },
  {
    title: 'Operations',
    items: [
      { name: 'Transactions', href: 'transactions', icon: ArrowLeftRight },
      { name: 'Financial Operations', href: 'financialOperations', icon: DollarSign },
      { name: 'Income', href: 'income', icon: TrendingUp },
      { name: 'Expenses', href: 'expenses', icon: TrendingDown },
      { name: 'Payroll / Salary', href: 'payroll', icon: DollarSign },
      { name: 'Recurring Expenses', href: 'recurring', icon: Repeat },
    ],
  },
  {
    title: 'Approval Management',
    items: [
      { name: 'Approvals', href: 'approvals', icon: CheckSquare },
      { name: 'Approval Rules', href: 'approvalRules', icon: AlertCircle },
    ],
  },
  {
    title: 'Budgeting',
    items: [
      { name: 'Budgets', href: 'budgets', icon: PieChart },
      { name: 'Budget Monitoring', href: 'budgetMonitoring', icon: BarChart3 },
    ],
  },
  {
    title: 'Reporting & Analytics',
    items: [
      { name: 'Reports', href: 'reports', icon: FileText },
      { name: 'Analytics Dashboard', href: 'analytics', icon: BarChart3 },
    ],
  },
  {
    title: 'System & Controls',
    items: [
      { name: 'Audit Logs', href: 'auditLogs', icon: ClipboardList },
      { name: 'Currency Settings', href: 'currency', icon: Coins },
    ],
  },
  {
    title: 'Utilities',
    items: [
      { name: 'Profile', href: 'profile', icon: User },
      { name: 'Help / Support', href: 'help', icon: HelpCircle },
    ],
  },
];

const revenueData = [
  { month: 'Jan', revenue: 45000, expenses: 32000 },
  { month: 'Feb', revenue: 52000, expenses: 35000 },
  { month: 'Mar', revenue: 48000, expenses: 33000 },
  { month: 'Apr', revenue: 61000, expenses: 38000 },
  { month: 'May', revenue: 55000, expenses: 36000 },
  { month: 'Jun', revenue: 67000, expenses: 41000 },
];

const transactionData = [
  { category: 'Sales', amount: 125000 },
  { category: 'Services', amount: 89000 },
  { category: 'Products', amount: 67000 },
  { category: 'Subscriptions', amount: 45000 },
  { category: 'Other', amount: 23000 },
];

export default function OrganizationDashboard() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const orgId = params.orgId as string;
  // Get organization name from localStorage or state (in real app, fetch from API)
  const orgName = initialCompanies.find(c => c.id === orgId)?.name ?? `Organization ${orgId}`;

  const isActivePath = (href: string) => {
    const basePath = `/dashboard/organizations/${orgId}`;
    if (href === '') {
      return pathname === basePath || pathname === `${basePath}/`;
    }
    return pathname.startsWith(`${basePath}/${href}`);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      

      {/* Main Content */}
      <div className="flex flex-col flex-1 min-w-0">
        
        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Total Revenue"
                value="$328,000"
                icon={DollarSign}
                variant="emerald"
                trend="up"
                change="+12.5%"
                subtitle="from last month"
              />

              <StatCard
                title="Total Expenses"
                value="$215,000"
                icon={TrendingDown}
                variant="blue"
                trend="down"
                change="-3.2%"
                subtitle="from last month"
              />

              <StatCard
                title="Net Profit"
                value="$113,000"
                icon={TrendingUp}
                variant="purple"
                trend="up"
                change="+18.3%"
                subtitle="from last month"
              />

              <StatCard
                title="Active Clients"
                value="1,234"
                icon={Users}
                variant="orange"
                trend="up"
                change="+8.1%"
                subtitle="from last month"
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Revenue vs Expenses Chart */}
              <SectionCard title="Revenue vs Expenses">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      name="Revenue"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="expenses" 
                      stroke="#ef4444" 
                      strokeWidth={2}
                      name="Expenses"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </SectionCard>

              {/* Transaction Categories Chart */}
              <SectionCard title="Income by Category">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={transactionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="amount" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </SectionCard>
            </div>

            {/* Recent Activity */}
            <SectionCard title="Recent Transactions">
              <div className="space-y-4">
                {[
                  { id: 1, description: 'Payment from Client ABC', amount: '+$5,400', date: '2 hours ago', type: 'income' },
                  { id: 2, description: 'Office Supplies Purchase', amount: '-$342', date: '5 hours ago', type: 'expense' },
                  { id: 3, description: 'Monthly Subscription Revenue', amount: '+$12,500', date: '1 day ago', type: 'income' },
                  { id: 4, description: 'Software License Renewal', amount: '-$899', date: '2 days ago', type: 'expense' },
                  { id: 5, description: 'Consulting Services Payment', amount: '+$8,750', date: '3 days ago', type: 'income' },
                ].map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between py-3 border-b last:border-0">
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-gray-600">{transaction.date}</p>
                    </div>
                    <span className={`font-semibold ${
                      transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      {transaction.amount}
                    </span>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        </main>
        
      </div>
    </div>
  );
}