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
  ChevronRight
} from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Card } from '@/src/components/ui/card';
import { cn } from '@/lib/utils';
import { initialCompanies } from '../page';


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
      { name: 'Organization Management', href: 'organization', icon: Building2 },
      { name: 'Organization Settings', href: 'org-settings', icon: Settings },
      { name: 'Departments / Projects', href: 'departments', icon: FolderKanban },
      { name: 'Users Management', href: 'users', icon: Users },
      { name: 'Roles & Permissions', href: 'roles', icon: Shield },
    ],
  },
  {
    title: 'Operations',
    items: [
      { name: 'Transactions', href: 'transactions', icon: ArrowLeftRight },
      { name: 'Financial Operations', href: 'financial-operations', icon: DollarSign },
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
      { name: 'Approval Rules', href: 'approval-rules', icon: AlertCircle },
    ],
  },
  {
    title: 'Budgeting',
    items: [
      { name: 'Budgets', href: 'budgets', icon: PieChart },
      { name: 'Budget Monitoring', href: 'budget-monitoring', icon: BarChart3 },
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
      { name: 'Audit Logs', href: 'audit-logs', icon: ClipboardList },
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
    <div className="min-h-screen bg-gray-50 flex">
      

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="space-y-6">
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Welcome to {orgName}
              </h2>
              <p className="text-gray-600">
                Select a section from the sidebar to get started.
              </p>
            </div>
          </div>
        </main>
        
      </div>
    </div>
  );
}