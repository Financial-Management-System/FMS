/**
 * Client-side Pusher configuration
 * This file should only be imported in client components
 */

import PusherClient from 'pusher-js';

// Validate required environment variables
if (!process.env.NEXT_PUBLIC_PUSHER_KEY) {
  throw new Error('NEXT_PUBLIC_PUSHER_KEY is not defined');
}

if (!process.env.NEXT_PUBLIC_PUSHER_CLUSTER) {
  throw new Error('NEXT_PUBLIC_PUSHER_CLUSTER is not defined');
}

// Initialize Pusher client instance (singleton pattern)
let pusherInstance: PusherClient | null = null;

export function getPusherClient(): PusherClient {
  if (!pusherInstance) {
    pusherInstance = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      forceTLS: true,
      // Optional: Enable for debugging
      // enabledTransports: ['ws', 'wss'],
      // disableStats: true,
    });
  }
  return pusherInstance;
}

// Export the client for convenience
export const pusherClient = getPusherClient();
