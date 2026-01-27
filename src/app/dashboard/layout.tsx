'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ArrowLeftRight, Users, FileText, Settings, Building2 } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { NotificationListener } from '@/src/components/custom/NotificationListener';
import { NotificationProvider } from '@/src/contexts/NotificationContext';
import { NotificationBell } from '@/src/components/custom/NotificationBell';

export default function layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navigation = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Transactions', href: '/dashboard/transactions', icon: ArrowLeftRight },
    { name: 'Users', href: '/dashboard/users', icon: Users },
    { name: 'Reports', href: '/dashboard/reports', icon: FileText },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
    { name: 'Organizations', href: '/dashboard/organizations', icon: Building2 },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  // Hide the dashboard navigation cards when viewing an organization detail
  // route like /dashboard/organizations/<orgId>
  const isOrgDetailRoute = /^\/dashboard\/organizations\/[^/]+(\/|$)/.test(pathname || '');

  return (
    <NotificationProvider>
      <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
        {/* Real-time Notification Listener */}
        <NotificationListener />
      
      {/* Header */}
      <header className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl">FinanceAdmin</h1>
              <p className="text-xs text-gray-500">Super Admin Protocol</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <NotificationBell />
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
              Active Session
            </Badge>
            <Avatar>
              <AvatarFallback className="bg-emerald-600 text-white">SA</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-6">
        {/* Navigation Cards */}
          {!isOrgDetailRoute && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link key={item.name} href={item.href}>
                <Card className={`cursor-pointer transition-all hover:shadow-lg ${
                  active 
                    ? 'border-emerald-500 shadow-md bg-emerald-50' 
                    : 'hover:border-emerald-300'
                }`}>
                  <CardContent className="p-6 flex flex-col items-center justify-center gap-3">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      active 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-sm text-center ${
                      active ? 'text-emerald-700' : 'text-gray-700'
                    }`}>
                      {item.name}
                    </span>
                  </CardContent>
                </Card>
              </Link>
            );
            })}
          </div>
        )}

        {/* Page Content */}
        {children}
        </div>
      </main>
      </div>
    </NotificationProvider>
  );
  
}
