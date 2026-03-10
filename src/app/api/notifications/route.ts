/**
 * API Route for triggering Pusher notifications
 * POST /api/notifications
 */

import { NextResponse } from 'next/server';
import { triggerNotification } from '@/src/lib/pusher-server';
import { z } from 'zod';

// Validation schema for notification payload
const notificationSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  message: z.string().min(1, 'Message is required'),
  type: z.enum(['success', 'error', 'warning', 'info']).default('info'),
  channel: z.string().default('notifications'),
  userId: z.string().optional(), // For user-specific notifications
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate request body
    const validation = notificationSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid request data',
          errors: validation.error.issues,
        },
        { status: 400 }
      );
    }

    const { title, message, type, channel, userId } = validation.data;

    // Determine the channel - user-specific or broadcast
    const targetChannel = userId ? `private-user-${userId}` : channel;

    // Trigger the notification via Pusher
    await triggerNotification(targetChannel, 'notification:new', {
      title,
      message,
      type,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Notification sent successfully',
        data: {
          channel: targetChannel,
          title,
          message,
          type,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending notification:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to send notification',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * Example usage with fetch:
 * 
 * const response = await fetch('/api/notifications', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({
 *     title: 'New Transaction',
 *     message: 'A new transaction has been created',
 *     type: 'success',
 *   }),
 * });
 */
