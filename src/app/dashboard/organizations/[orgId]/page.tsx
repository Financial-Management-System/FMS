"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import Link from "next/link";
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
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { cn } from "@/lib/utils";
import { initialCompanies } from "../page";

import { CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
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
  Legend,
} from "recharts";

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
    title: "Core",
    items: [
      { name: "Dashboard", href: "", icon: LayoutDashboard },
      { name: "Notifications", href: "notifications", icon: Bell },
      {
        name: "Organization Management",
        href: "organization",
        icon: Building2,
      },
      { name: "Organization Settings", href: "org-settings", icon: Settings },
      {
        name: "Departments / Projects",
        href: "departments",
        icon: FolderKanban,
      },
      { name: "Users Management", href: "users", icon: Users },
      { name: "Roles & Permissions", href: "roles", icon: Shield },
    ],
  },
  {
    title: "Operations",
    items: [
      { name: "Transactions", href: "transactions", icon: ArrowLeftRight },
      {
        name: "Financial Operations",
        href: "financial-operations",
        icon: DollarSign,
      },
      { name: "Income", href: "income", icon: TrendingUp },
      { name: "Expenses", href: "expenses", icon: TrendingDown },
      { name: "Payroll / Salary", href: "payroll", icon: DollarSign },
      { name: "Recurring Expenses", href: "recurring", icon: Repeat },
    ],
  },
  {
    title: "Approval Management",
    items: [
      { name: "Approvals", href: "approvals", icon: CheckSquare },
      { name: "Approval Rules", href: "approval-rules", icon: AlertCircle },
    ],
  },
  {
    title: "Budgeting",
    items: [
      { name: "Budgets", href: "budgets", icon: PieChart },
      { name: "Budget Monitoring", href: "budget-monitoring", icon: BarChart3 },
    ],
  },
  {
    title: "Reporting & Analytics",
    items: [
      { name: "Reports", href: "reports", icon: FileText },
      { name: "Analytics Dashboard", href: "analytics", icon: BarChart3 },
    ],
  },
  {
    title: "System & Controls",
    items: [
      { name: "Audit Logs", href: "audit-logs", icon: ClipboardList },
      { name: "Currency Settings", href: "currency", icon: Coins },
    ],
  },
  {
    title: "Utilities",
    items: [
      { name: "Profile", href: "profile", icon: User },
      { name: "Help / Support", href: "help", icon: HelpCircle },
    ],
  },
];

export default function OrganizationDashboard() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const orgId = params.orgId as string;
  // Get organization name from localStorage or state (in real app, fetch from API)
  const orgName =
    initialCompanies.find((c) => c.id === orgId)?.name ??
    `Organization ${orgId}`;

  const isActivePath = (href: string) => {
    const basePath = `/dashboard/organizations/${orgId}`;
    if (href === "") {
      return pathname === basePath || pathname === `${basePath}/`;
    }
    return pathname.startsWith(`${basePath}/${href}`);
  };

  const revenueData = [
    { month: "Jan", revenue: 45000, expenses: 32000 },
    { month: "Feb", revenue: 52000, expenses: 35000 },
    { month: "Mar", revenue: 48000, expenses: 33000 },
    { month: "Apr", revenue: 61000, expenses: 38000 },
    { month: "May", revenue: 55000, expenses: 36000 },
    { month: "Jun", revenue: 67000, expenses: 41000 },
  ];

  const transactionData = [
    { category: "Sales", amount: 125000 },
    { category: "Services", amount: 89000 },
    { category: "Products", amount: 67000 },
    { category: "Subscriptions", amount: 45000 },
    { category: "Other", amount: 23000 },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl mt-1">$328,000</p>
                <div className="flex items-center gap-1 mt-2 text-emerald-600 text-sm">
                  <ArrowUpRight className="w-4 h-4" />
                  <span>12.5% from last month</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Expenses</p>
                <p className="text-2xl mt-1">$215,000</p>
                <div className="flex items-center gap-1 mt-2 text-emerald-600 text-sm">
                  <ArrowDownRight className="w-4 h-4" />
                  <span>3.2% from last month</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Net Profit</p>
                <p className="text-2xl mt-1">$113,000</p>
                <div className="flex items-center gap-1 mt-2 text-emerald-600 text-sm">
                  <ArrowUpRight className="w-4 h-4" />
                  <span>18.3% from last month</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Clients</p>
                <p className="text-2xl mt-1">1,234</p>
                <div className="flex items-center gap-1 mt-2 text-emerald-600 text-sm">
                  <ArrowUpRight className="w-4 h-4" />
                  <span>8.1% from last month</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue vs Expenses Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue vs Expenses</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>

        {/* Transaction Categories Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Income by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={transactionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                id: 1,
                description: "Payment from Client ABC",
                amount: "+$5,400",
                date: "2 hours ago",
                type: "income",
              },
              {
                id: 2,
                description: "Office Supplies Purchase",
                amount: "-$342",
                date: "5 hours ago",
                type: "expense",
              },
              {
                id: 3,
                description: "Monthly Subscription Revenue",
                amount: "+$12,500",
                date: "1 day ago",
                type: "income",
              },
              {
                id: 4,
                description: "Software License Renewal",
                amount: "-$899",
                date: "2 days ago",
                type: "expense",
              },
              {
                id: 5,
                description: "Consulting Services Payment",
                amount: "+$8,750",
                date: "3 days ago",
                type: "income",
              },
            ].map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between py-3 border-b last:border-0"
              >
                <div>
                  <p className="font-medium">{transaction.description}</p>
                  <p className="text-sm text-gray-600">{transaction.date}</p>
                </div>
                <span
                  className={`font-semibold ${
                    transaction.type === "income"
                      ? "text-emerald-600"
                      : "text-red-600"
                  }`}
                >
                  {transaction.amount}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
