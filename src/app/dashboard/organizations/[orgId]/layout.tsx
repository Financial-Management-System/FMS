"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter, usePathname } from 'next/navigation';
import { X, ChevronLeft, LogOut, Menu } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { cn } from '@/lib/utils';
import { sidebarSections } from './page';

interface Organization {
  _id: string;
  name: string;
  org_id: string;
}

export default function layout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [orgName, setOrgName] = useState<string>('');

  const orgId = params?.orgId as string;

  // Fetch organization name
  useEffect(() => {
    const fetchOrgName = async () => {
      try {
        const response = await fetch('/api/organization');
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            const org = result.data.find((o: Organization) => o.org_id === orgId);
            setOrgName(org?.name || `Organization ${orgId}`);
          }
        }
      } catch (error) {
        console.error('Error fetching organization:', error);
        setOrgName(`Organization ${orgId}`);
      }
    };

    if (orgId) {
      fetchOrgName();
    }
  }, [orgId]);

  const isActivePath = (href: string) => {
    const basePath = `/dashboard/organizations/${orgId}`;
    if (href === '') {
      return pathname === basePath || pathname === `${basePath}/`;
    }
    return pathname.startsWith(`${basePath}/${href}`);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-white border-r border-gray-200
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h2 className="text-lg truncate">{orgName}</h2>
                <p className="text-sm text-gray-600">Financial Dashboard</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setIsSidebarOpen(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-4"
              onClick={() => router.push('/dashboard/organizations')}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Organizations
            </Button>
          </div>

          {/* Sidebar Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto sidebar-scroll">
            <div className="space-y-6">
              {sidebarSections.map((section, sectionIndex) => (
                <div key={section.title}>
                  <h3 className="px-4 mb-2 text-xs tracking-wider text-gray-500 uppercase">
                    {section.title}
                  </h3>
                  <div className="space-y-1">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const active = isActivePath(item.href);
                      const href = item.href === '' 
                        ? `/dashboard/organizations/${orgId}` 
                        : `/dashboard/organizations/${orgId}/${item.href}`;
                      
                      return (
                        <Link
                          key={item.name}
                          href={href}
                          className={cn(
                            'flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm',
                            active 
                              ? 'bg-emerald-50 text-emerald-700 font-medium' 
                              : 'text-gray-700 hover:bg-gray-100'
                          )}
                          onClick={() => setIsSidebarOpen(false)}
                        >
                          <Icon className="flex-shrink-0 w-4 h-4" />
                          <span className="truncate">{item.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
              
              {/* Logout Button */}
              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={() => router.push('/dashboard/organizations')}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm w-full text-left text-red-600 hover:bg-red-50"
                >
                  <LogOut className="flex-shrink-0 w-4 h-4" />
                  <span className="truncate">Logout</span>
                </button>
              </div>
            </div>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Top Bar */}
        <header className="px-6 py-4 bg-white border-b border-gray-200">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl">
                {sidebarSections.flatMap(section => section.items).find(item => isActivePath(item.href))?.name || 'Dashboard'}
              </h1>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
