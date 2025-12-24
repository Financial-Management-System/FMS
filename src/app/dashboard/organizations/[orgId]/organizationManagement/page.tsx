'use client';

import { useState } from 'react';
import { Card } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Building2, Edit, Save, X, MapPin, Phone, Mail, Globe, Users, Calendar } from 'lucide-react';

interface OrganizationInfo {
  name: string;
  legalName: string;
  taxId: string;
  industry: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  email: string;
  website: string;
  founded: string;
  employeeCount: string;
  fiscalYearEnd: string;
}

const mockOrgInfo: OrganizationInfo = {
  name: 'Acme Corporation',
  legalName: 'Acme Corporation Inc.',
  taxId: '12-3456789',
  industry: 'Technology',
  address: '123 Business Street',
  city: 'San Francisco',
  state: 'CA',
  zipCode: '94105',
  country: 'United States',
  phone: '+1 (555) 123-4567',
  email: 'contact@acmecorp.com',
  website: 'www.acmecorp.com',
  founded: '2010',
  employeeCount: '250-500',
  fiscalYearEnd: 'December 31',
};

export default function OrgManagement() {
  const [isEditing, setIsEditing] = useState(false);
  const [orgInfo, setOrgInfo] = useState<OrganizationInfo>(mockOrgInfo);
  const [editedInfo, setEditedInfo] = useState<OrganizationInfo>(mockOrgInfo);

  const handleSave = () => {
    setOrgInfo(editedInfo);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedInfo(orgInfo);
    setIsEditing(false);
  };

  const InfoField = ({ label, value, icon: Icon, field }: { label: string; value: string; icon: any; field: keyof OrganizationInfo }) => (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm text-gray-600">
        <Icon className="w-4 h-4" />
        {label}
      </label>
      {isEditing ? (
        <Input
          value={editedInfo[field]}
          onChange={(e) => setEditedInfo({ ...editedInfo, [field]: e.target.value })}
        />
      ) : (
        <p className="text-gray-900">{value}</p>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl">Organization Management</h2>
          <p className="text-gray-600">Manage your organization information and settings</p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Information
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Basic Information */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-emerald-100">
              <Building2 className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h3>Basic Information</h3>
              <p className="text-sm text-gray-600">Organization details</p>
            </div>
          </div>
          <div className="space-y-4">
            <InfoField label="Organization Name" value={orgInfo.name} icon={Building2} field="name" />
            <InfoField label="Legal Name" value={orgInfo.legalName} icon={Building2} field="legalName" />
            <InfoField label="Tax ID / EIN" value={orgInfo.taxId} icon={Building2} field="taxId" />
            <InfoField label="Industry" value={orgInfo.industry} icon={Building2} field="industry" />
          </div>
        </Card>

        {/* Contact Information */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3>Contact Information</h3>
              <p className="text-sm text-gray-600">Communication details</p>
            </div>
          </div>
          <div className="space-y-4">
            <InfoField label="Email Address" value={orgInfo.email} icon={Mail} field="email" />
            <InfoField label="Phone Number" value={orgInfo.phone} icon={Phone} field="phone" />
            <InfoField label="Website" value={orgInfo.website} icon={Globe} field="website" />
          </div>
        </Card>

        {/* Address Information */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg">
              <MapPin className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3>Address Information</h3>
              <p className="text-sm text-gray-600">Physical location</p>
            </div>
          </div>
          <div className="space-y-4">
            <InfoField label="Street Address" value={orgInfo.address} icon={MapPin} field="address" />
            <div className="grid grid-cols-2 gap-4">
              <InfoField label="City" value={orgInfo.city} icon={MapPin} field="city" />
              <InfoField label="State" value={orgInfo.state} icon={MapPin} field="state" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <InfoField label="ZIP Code" value={orgInfo.zipCode} icon={MapPin} field="zipCode" />
              <InfoField label="Country" value={orgInfo.country} icon={MapPin} field="country" />
            </div>
          </div>
        </Card>

        {/* Organization Details */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-amber-100">
              <Calendar className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h3>Organization Details</h3>
              <p className="text-sm text-gray-600">Additional information</p>
            </div>
          </div>
          <div className="space-y-4">
            <InfoField label="Founded" value={orgInfo.founded} icon={Calendar} field="founded" />
            <InfoField label="Employee Count" value={orgInfo.employeeCount} icon={Users} field="employeeCount" />
            <InfoField label="Fiscal Year End" value={orgInfo.fiscalYearEnd} icon={Calendar} field="fiscalYearEnd" />
          </div>
        </Card>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <div className="mb-1 text-sm text-gray-600">Total Departments</div>
          <div className="text-2xl">12</div>
        </Card>
        <Card className="p-4">
          <div className="mb-1 text-sm text-gray-600">Active Users</div>
          <div className="text-2xl">348</div>
        </Card>
        <Card className="p-4">
          <div className="mb-1 text-sm text-gray-600">Active Projects</div>
          <div className="text-2xl">27</div>
        </Card>
        <Card className="p-4">
          <div className="mb-1 text-sm text-gray-600">Monthly Budget</div>
          <div className="text-2xl">$2.5M</div>
        </Card>
      </div>
    </div>
  );
}
