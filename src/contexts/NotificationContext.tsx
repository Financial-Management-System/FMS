'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { NotificationPayload } from '@/src/types';

interface StoredNotification extends NotificationPayload {
  id: string;
  read: boolean;
}

interface NotificationContextType {
  notifications: StoredNotification[];
  unreadCount: number;
  addNotification: (notification: NotificationPayload) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<StoredNotification[]>([]);

  const addNotification = useCallback((notification: NotificationPayload) => {
    const newNotification: StoredNotification = {
      ...notification,
      id: `notif-${Date.now()}-${Math.random()}`,
      read: false,
      timestamp: notification.timestamp || new Date().toISOString(),
    };

    setNotifications((prev) => [newNotification, ...prev].slice(0, 50)); // Keep last 50
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, read: true }))
    );
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
}
