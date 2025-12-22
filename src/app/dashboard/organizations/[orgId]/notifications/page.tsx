"use client";

import { useState } from 'react';
import { Card } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Bell, CheckCheck, Trash2, AlertCircle, Info, CheckCircle, TrendingUp, Users, FileText } from 'lucide-react';
import { cn } from '@/src/components/ui/utils';

interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'alert';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  category: 'transaction' | 'approval' | 'budget' | 'team' | 'system';
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'alert',
    title: 'Approval Required',
    message: 'Expense report #EXP-2024-001 from John Doe requires your approval ($2,450.00)',
    timestamp: '5 minutes ago',
    read: false,
    category: 'approval'
  },
  {
    id: '2',
    type: 'warning',
    title: 'Budget Alert',
    message: 'Marketing department has reached 90% of monthly budget',
    timestamp: '1 hour ago',
    read: false,
    category: 'budget'
  },
  {
    id: '3',
    type: 'success',
    title: 'Transaction Completed',
    message: 'Payment of $5,200.00 to vendor ABC Corp has been processed',
    timestamp: '2 hours ago',
    read: true,
    category: 'transaction'
  },
  {
    id: '4',
    type: 'info',
    title: 'New Team Member',
    message: 'Sarah Johnson has been added to the Finance team',
    timestamp: '1 day ago',
    read: true,
    category: 'team'
  },
  {
    id: '5',
    type: 'info',
    title: 'Report Generated',
    message: 'Monthly financial report for December 2024 is now available',
    timestamp: '2 days ago',
    read: true,
    category: 'system'
  },
];

export default function OrgNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-amber-600" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'transaction':
        return <TrendingUp className="w-4 h-4" />;
      case 'approval':
        return <CheckCircle className="w-4 h-4" />;
      case 'budget':
        return <TrendingUp className="w-4 h-4" />;
      case 'team':
        return <Users className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.read)
    : notifications;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl">Notifications</h2>
          <p className="text-gray-600">
            {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button
            variant={filter === 'unread' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('unread')}
          >
            Unread ({unreadCount})
          </Button>
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={markAllAsRead}
            >
              <CheckCheck className="w-4 h-4 mr-2" />
              Mark all as read
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <Card className="p-12 text-center">
            <Bell className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3>No notifications</h3>
            <p className="text-gray-600">You're all caught up!</p>
          </Card>
        ) : (
          filteredNotifications.map((notification) => (
            <Card
              key={notification.id}
              className={cn(
                'p-4 transition-colors',
                !notification.read && 'bg-emerald-50 border-emerald-200'
              )}
            >
              <div className="flex gap-4">
                <div className="flex-shrink-0 mt-1">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-base">{notification.title}</h3>
                        {!notification.read && (
                          <span className="w-2 h-2 bg-emerald-600 rounded-full"></span>
                        )}
                      </div>
                      <p className="text-gray-700 mb-2">{notification.message}</p>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span>{notification.timestamp}</span>
                        <span className="flex items-center gap-1">
                          {getCategoryIcon(notification.category)}
                          <span className="capitalize">{notification.category}</span>
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                          title="Mark as read"
                        >
                          <CheckCheck className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteNotification(notification.id)}
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

