'use client';

import { useState } from 'react';
import { Card } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Settings, Lock, Bell, Globe, Shield, Clock, Eye, EyeOff, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function OrgSettings() {
  const [settings, setSettings] = useState({
    // Security Settings
    twoFactorEnabled: true,
    sessionTimeout: '30',
    passwordExpiry: '90',
    ipWhitelist: false,
    
    // Notification Settings
    emailNotifications: true,
    pushNotifications: false,
    weeklyReports: true,
    budgetAlerts: true,
    approvalRequests: true,
    
    // General Settings
    timezone: 'America/New_York',
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY',
    fiscalYearStart: 'January',
    
    // Privacy Settings
    dataRetention: '7 years',
    auditLogs: true,
    dataEncryption: true,
  });

  const [activeTab, setActiveTab] = useState<'security' | 'notifications' | 'general' | 'privacy'>('security');

  const ToggleSetting = ({ 
    label, 
    description, 
    checked, 
    onChange 
  }: { 
    label: string; 
    description: string; 
    checked: boolean; 
    onChange: (checked: boolean) => void;
  }) => (
    <div className="flex items-start justify-between p-4 rounded-lg bg-gray-50">
      <div className="flex-1">
        <div className="font-medium">{label}</div>
        <div className="mt-1 text-sm text-gray-600">{description}</div>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={cn(
          'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
          checked ? 'bg-emerald-600' : 'bg-gray-300'
        )}
      >
        <span
          className={cn(
            'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
            checked ? 'translate-x-6' : 'translate-x-1'
          )}
        />
      </button>
    </div>
  );

  const tabs = [
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'general', label: 'General', icon: Settings },
    { id: 'privacy', label: 'Privacy', icon: Shield },
  ] as const;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl">Organization Settings</h2>
        <p className="text-gray-600">Configure security, notifications, and preferences</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={cn(
              'flex items-center gap-2 px-4 py-3 border-b-2 transition-colors',
              activeTab === id
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Security Settings */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg">
                <Lock className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3>Security Settings</h3>
                <p className="text-sm text-gray-600">Manage authentication and access controls</p>
              </div>
            </div>

            <div className="space-y-4">
              <ToggleSetting
                label="Two-Factor Authentication"
                description="Require 2FA for all users to enhance account security"
                checked={settings.twoFactorEnabled}
                onChange={(checked) => setSettings({ ...settings, twoFactorEnabled: checked })}
              />

              <ToggleSetting
                label="IP Whitelist"
                description="Restrict access to specific IP addresses only"
                checked={settings.ipWhitelist}
                onChange={(checked) => setSettings({ ...settings, ipWhitelist: checked })}
              />

              <div className="p-4 space-y-3 rounded-lg bg-gray-50">
                <label className="block">
                  <span className="text-sm font-medium">Session Timeout (minutes)</span>
                  <Input
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => setSettings({ ...settings, sessionTimeout: e.target.value })}
                    className="mt-2"
                  />
                </label>
              </div>

              <div className="p-4 space-y-3 rounded-lg bg-gray-50">
                <label className="block">
                  <span className="text-sm font-medium">Password Expiry (days)</span>
                  <Input
                    type="number"
                    value={settings.passwordExpiry}
                    onChange={(e) => setSettings({ ...settings, passwordExpiry: e.target.value })}
                    className="mt-2"
                  />
                </label>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Notification Settings */}
      {activeTab === 'notifications' && (
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                <Bell className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3>Notification Preferences</h3>
                <p className="text-sm text-gray-600">Control how you receive notifications</p>
              </div>
            </div>

            <div className="space-y-4">
              <ToggleSetting
                label="Email Notifications"
                description="Receive updates and alerts via email"
                checked={settings.emailNotifications}
                onChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
              />

              <ToggleSetting
                label="Push Notifications"
                description="Get instant notifications in your browser"
                checked={settings.pushNotifications}
                onChange={(checked) => setSettings({ ...settings, pushNotifications: checked })}
              />

              <ToggleSetting
                label="Weekly Reports"
                description="Receive weekly financial summary reports"
                checked={settings.weeklyReports}
                onChange={(checked) => setSettings({ ...settings, weeklyReports: checked })}
              />

              <ToggleSetting
                label="Budget Alerts"
                description="Get notified when budgets reach thresholds"
                checked={settings.budgetAlerts}
                onChange={(checked) => setSettings({ ...settings, budgetAlerts: checked })}
              />

              <ToggleSetting
                label="Approval Requests"
                description="Notify when expenses require approval"
                checked={settings.approvalRequests}
                onChange={(checked) => setSettings({ ...settings, approvalRequests: checked })}
              />
            </div>
          </Card>
        </div>
      )}

      {/* General Settings */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-emerald-100">
                <Globe className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3>General Settings</h3>
                <p className="text-sm text-gray-600">Configure regional and display preferences</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-gray-50">
                <label className="block">
                  <span className="text-sm font-medium">Timezone</span>
                  <select 
                    className="w-full px-3 py-2 mt-2 border border-gray-300 rounded-lg"
                    value={settings.timezone}
                    onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                  >
                    <option value="America/New_York">Eastern Time (ET)</option>
                    <option value="America/Chicago">Central Time (CT)</option>
                    <option value="America/Denver">Mountain Time (MT)</option>
                    <option value="America/Los_Angeles">Pacific Time (PT)</option>
                    <option value="Europe/London">London (GMT)</option>
                  </select>
                </label>
              </div>

              <div className="p-4 rounded-lg bg-gray-50">
                <label className="block">
                  <span className="text-sm font-medium">Currency</span>
                  <select 
                    className="w-full px-3 py-2 mt-2 border border-gray-300 rounded-lg"
                    value={settings.currency}
                    onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                  >
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="JPY">JPY - Japanese Yen</option>
                  </select>
                </label>
              </div>

              <div className="p-4 rounded-lg bg-gray-50">
                <label className="block">
                  <span className="text-sm font-medium">Date Format</span>
                  <select 
                    className="w-full px-3 py-2 mt-2 border border-gray-300 rounded-lg"
                    value={settings.dateFormat}
                    onChange={(e) => setSettings({ ...settings, dateFormat: e.target.value })}
                  >
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </label>
              </div>

              <div className="p-4 rounded-lg bg-gray-50">
                <label className="block">
                  <span className="text-sm font-medium">Fiscal Year Start</span>
                  <select 
                    className="w-full px-3 py-2 mt-2 border border-gray-300 rounded-lg"
                    value={settings.fiscalYearStart}
                    onChange={(e) => setSettings({ ...settings, fiscalYearStart: e.target.value })}
                  >
                    <option value="January">January</option>
                    <option value="April">April</option>
                    <option value="July">July</option>
                    <option value="October">October</option>
                  </select>
                </label>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Privacy Settings */}
      {activeTab === 'privacy' && (
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3>Privacy & Data Settings</h3>
                <p className="text-sm text-gray-600">Manage data retention and privacy controls</p>
              </div>
            </div>

            <div className="space-y-4">
              <ToggleSetting
                label="Audit Logs"
                description="Maintain detailed logs of all system activities"
                checked={settings.auditLogs}
                onChange={(checked) => setSettings({ ...settings, auditLogs: checked })}
              />

              <ToggleSetting
                label="Data Encryption"
                description="Encrypt sensitive data at rest and in transit"
                checked={settings.dataEncryption}
                onChange={(checked) => setSettings({ ...settings, dataEncryption: checked })}
              />

              <div className="p-4 rounded-lg bg-gray-50">
                <label className="block">
                  <span className="text-sm font-medium">Data Retention Period</span>
                  <select 
                    className="w-full px-3 py-2 mt-2 border border-gray-300 rounded-lg"
                    value={settings.dataRetention}
                    onChange={(e) => setSettings({ ...settings, dataRetention: e.target.value })}
                  >
                    <option value="1 year">1 Year</option>
                    <option value="3 years">3 Years</option>
                    <option value="5 years">5 Years</option>
                    <option value="7 years">7 Years</option>
                    <option value="Indefinite">Indefinite</option>
                  </select>
                </label>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-amber-50 border-amber-200">
            <div className="flex gap-3">
              <Shield className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-amber-900">Data Protection Notice</h3>
                <p className="mt-1 text-sm text-amber-700">
                  We take data privacy seriously. All data is encrypted and stored securely. 
                  You can request data export or deletion at any time by contacting support.
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <Button variant="outline">Reset to Defaults</Button>
        <Button>
          <Check className="w-4 h-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  );
}
