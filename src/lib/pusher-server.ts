/**
 * Server-side Pusher configuration
 * This file should only be imported in API routes or server components
 */

import Pusher from 'pusher';

// Ensure this is only used server-side
if (typeof window !== 'undefined') {
  throw new Error('pusher-server should only be used on the server side');
}

// Validate required environment variables
const requiredEnvVars = {
  PUSHER_APP_ID: process.env.PUSHER_APP_ID,
  NEXT_PUBLIC_PUSHER_KEY: process.env.NEXT_PUBLIC_PUSHER_KEY,
  PUSHER_SECRET: process.env.PUSHER_SECRET,
  NEXT_PUBLIC_PUSHER_CLUSTER: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
};

const missingVars = Object.entries(requiredEnvVars)
  .filter(([_, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  throw new Error(
    `Missing required Pusher environment variables: ${missingVars.join(', ')}`
  );
}

// Initialize Pusher server instance
export const pusherServer = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
});

/**
 * Helper function to trigger a notification
 * @param channel - The channel name to trigger on
 * @param event - The event name
 * @param data - The notification data
 */
export async function triggerNotification(
  channel: string,
  event: string,
  data: any
) {
  try {
    await pusherServer.trigger(channel, event, data);
    return { success: true };
  } catch (error) {
    console.error('Failed to trigger Pusher event:', error);
    throw error;
  }
}
