'use client';

import { useState } from 'react';
import { Card } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { User, Mail, Phone, Briefcase, Building, Edit, Save, Camera } from 'lucide-react';
import  FormDialog  from '@/src/components/custom/formDialog';
import { z } from 'zod';
import { profileSchema } from '@/src/schema';

interface Profile {
  fullName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  bio?: string;
  avatar?: string;
  joinDate: string;
  location: string;
}

const formFields = [
  { name: 'fullName' as const, label: 'Full Name', type: 'text' as const, placeholder: 'Your full name' },
  { name: 'email' as const, label: 'Email', type: 'text' as const, placeholder: 'your.email@company.com' },
  { name: 'phone' as const, label: 'Phone', type: 'text' as const, placeholder: '+1 (555) 000-0000' },
  { name: 'position' as const, label: 'Position', type: 'text' as const, placeholder: 'Your job title' },
  { name: 'department' as const, label: 'Department', type: 'text' as const, placeholder: 'Your department' },
  { name: 'bio' as const, label: 'Bio (Optional)', type: 'textarea' as const, placeholder: 'Tell us about yourself' },
];

export default function OrgProfile() {
  const [profile, setProfile] = useState<Profile>({
    fullName: 'John Smith',
    email: 'john.smith@company.com',
    phone: '+1 (555) 123-4567',
    position: 'Senior Financial Manager',
    department: 'Finance',
    bio: 'Experienced financial manager with 10+ years in corporate finance, specializing in budget management and financial planning.',
    joinDate: '2020-03-15',
    location: 'New York, USA'
  });
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleEdit = (data: z.infer<typeof profileSchema>) => {
    setProfile({ ...profile, ...data });
    setIsEditOpen(false);
  };

  const stats = [
    { label: 'Budgets Managed', value: '12' },
    { label: 'Approvals Given', value: '347' },
    { label: 'Reports Generated', value: '89' },
    { label: 'Team Members', value: '24' },
  ];

  const recentActivity = [
    { action: 'Approved expense request', details: '$12,500 - Marketing Campaign', time: '2 hours ago' },
    { action: 'Generated financial report', details: 'Q4 2024 Summary', time: '5 hours ago' },
    { action: 'Updated budget allocation', details: 'Engineering Q1 Budget', time: '1 day ago' },
    { action: 'Reviewed payroll', details: 'December 2025 Payroll', time: '2 days ago' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl text-gray-900">Profile</h2>
        <p className="mt-1 text-gray-600">Manage your profile settings and preferences</p>
      </div>

      {/* Profile Card */}
      <Card className="p-6">
        <div className="flex items-start gap-6">
          {/* Avatar */}
          <div className="relative">
            <div className="flex items-center justify-center w-32 h-32 rounded-full bg-emerald-100">
              <User className="w-16 h-16 text-emerald-600" />
            </div>
            <button className="absolute bottom-0 right-0 p-2 text-white transition-colors rounded-full bg-emerald-600 hover:bg-emerald-700">
              <Camera className="w-4 h-4" />
            </button>
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-2xl text-gray-900">{profile.fullName}</h3>
                <p className="mt-1 text-gray-600">{profile.position}</p>
              </div>
              <Button onClick={() => setIsEditOpen(true)} className="bg-emerald-600 hover:bg-emerald-700">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Mail className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm text-gray-900">{profile.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Phone className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="text-sm text-gray-900">{profile.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Building className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Department</p>
                  <p className="text-sm text-gray-900">{profile.department}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Briefcase className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Join Date</p>
                  <p className="text-sm text-gray-900">{profile.joinDate}</p>
                </div>
              </div>
            </div>

            {profile.bio && (
              <div className="p-4 rounded-lg bg-gray-50">
                <p className="text-sm text-gray-700">{profile.bio}</p>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-4">
            <p className="text-sm text-gray-600">{stat.label}</p>
            <p className="mt-1 text-2xl">{stat.value}</p>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg text-gray-900">Recent Activity</h3>
        <div className="space-y-4">
          {recentActivity.map((activity, idx) => (
            <div key={idx} className="flex items-start gap-3 pb-4 border-b border-gray-200 last:border-0 last:pb-0">
              <div className="w-2 h-2 mt-2 rounded-full bg-emerald-600" />
              <div className="flex-1">
                <p className="text-sm text-gray-900">{activity.action}</p>
                <p className="mt-1 text-sm text-gray-600">{activity.details}</p>
                <p className="mt-1 text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Security Settings */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg text-gray-900">Security Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-900">Two-Factor Authentication</p>
              <p className="mt-1 text-xs text-gray-500">Add an extra layer of security to your account</p>
            </div>
            <Button size="sm" variant="outline">Enable</Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-900">Change Password</p>
              <p className="mt-1 text-xs text-gray-500">Update your password regularly</p>
            </div>
            <Button size="sm" variant="outline">Change</Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-900">Active Sessions</p>
              <p className="mt-1 text-xs text-gray-500">Manage your active login sessions</p>
            </div>
            <Button size="sm" variant="outline">View</Button>
          </div>
        </div>
      </Card>

      {/* Edit Profile Dialog */}
      {isEditOpen && (
        <FormDialog
          open={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          onSubmit={handleEdit}
          title="Edit Profile"
          description="Update your profile information"
          schema={profileSchema}
          fields={formFields}
          defaultValues={{
            fullName: profile.fullName,
            email: profile.email,
            phone: profile.phone,
            position: profile.position,
            department: profile.department,
            bio: profile.bio || '',
          }}
          submitLabel="Save Changes"
        />
      )}
    </div>
  );
}
