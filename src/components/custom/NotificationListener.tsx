/**
 * NotificationListener Component
 * Client-side component that listens for real-time notifications via Pusher
 */

'use client';

import { useEffect, useState } from 'react';
import { pusherClient } from '@/src/lib/pusher-client';
import { toast } from 'react-toastify';
import { useNotifications } from '@/src/contexts/NotificationContext';
import type { Channel } from 'pusher-js';

export interface PusherNotification {
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  timestamp: string;
}

interface NotificationListenerProps {
  channel?: string;
  userId?: string;
  onNotification?: (notification: PusherNotification) => void;
}

export function NotificationListener({
  channel = 'notifications',
  userId,
  onNotification,
}: NotificationListenerProps) {
  const [isConnected, setIsConnected] = useState(false);
  const { addNotification } = useNotifications();

  useEffect(() => {
    // Determine which channel to subscribe to
    const channelName = userId ? `private-user-${userId}` : channel;
    
    let pusherChannel: Channel | null = null;

    try {
      // Subscribe to the channel
      pusherChannel = pusherClient.subscribe(channelName);

      // Bind to the notification event
      pusherChannel.bind('notification:new', (data: PusherNotification) => {
        console.log('📬 Received notification:', data);

        // Add to notification context
        addNotification(data);

        // Call custom handler if provided
        if (onNotification) {
          onNotification(data);
        }

        // Display toast notification
        const toastOptions = {
          position: 'top-right' as const,
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        };

        switch (data.type) {
          case 'success':
            toast.success(`${data.title}: ${data.message}`, toastOptions);
            break;
          case 'error':
            toast.error(`${data.title}: ${data.message}`, toastOptions);
            break;
          case 'warning':
            toast.warning(`${data.title}: ${data.message}`, toastOptions);
            break;
          case 'info':
          default:
            toast.info(`${data.title}: ${data.message}`, toastOptions);
            break;
        }
      });

      // Connection state listeners
      pusherClient.connection.bind('connected', () => {
        console.log('✅ Pusher connected');
        setIsConnected(true);
      });

      pusherClient.connection.bind('disconnected', () => {
        console.log('❌ Pusher disconnected');
        setIsConnected(false);
      });

      pusherClient.connection.bind('error', (err: any) => {
        console.error('Pusher connection error:', err);
        setIsConnected(false);
      });

    } catch (error) {
      console.error('Failed to initialize Pusher:', error);
    }

    // Cleanup on unmount
    return () => {
      if (pusherChannel) {
        pusherChannel.unbind('notification:new');
        pusherClient.unsubscribe(channelName);
      }
      pusherClient.connection.unbind('connected');
      pusherClient.connection.unbind('disconnected');
      pusherClient.connection.unbind('error');
    };
  }, [channel, userId, onNotification]);

  // Optional: Display connection status indicator
  if (process.env.NODE_ENV === 'development') {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <div
          className={`px-3 py-1 text-xs rounded-full ${
            isConnected
              ? 'bg-green-500 text-white'
              : 'bg-gray-500 text-white'
          }`}
        >
          {isConnected ? '🟢 Live' : '🔴 Offline'}
        </div>
      </div>
    );
  }

  return null;
}
