'use client';

import { useState } from 'react';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { PageHeader } from '@/src/components/custom/pageHeader';

export default function TestNotificationPage() {
  const [title, setTitle] = useState('Test Notification');
  const [message, setMessage] = useState('This is a test notification!');
  const [type, setType] = useState<'success' | 'error' | 'info' | 'warning'>('success');
  const [loading, setLoading] = useState(false);

  const sendNotification = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          message,
          type,
        }),
      });

      const data = await response.json();
      console.log('Notification sent:', data);
    } catch (error) {
      console.error('Error sending notification:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Test Real-Time Notifications"
        description="Test the Pusher notification system"
      />

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Send Test Notification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Notification title"
            />
          </div>

          <div>
            <Label htmlFor="message">Message</Label>
            <Input
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Notification message"
            />
          </div>

          <div>
            <Label htmlFor="type">Type</Label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="success">Success</option>
              <option value="error">Error</option>
              <option value="info">Info</option>
              <option value="warning">Warning</option>
            </select>
          </div>

          <Button
            onClick={sendNotification}
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Sending...' : 'Send Notification'}
          </Button>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Quick Tests:</h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setTitle('Success!');
                  setMessage('Your transaction was completed');
                  setType('success');
                }}
              >
                Load Success Example
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setTitle('Error Occurred');
                  setMessage('Failed to process payment');
                  setType('error');
                }}
              >
                Load Error Example
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setTitle('Budget Alert');
                  setMessage('You have exceeded 80% of your budget');
                  setType('warning');
                }}
              >
                Load Warning Example
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
