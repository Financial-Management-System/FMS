'use client';

import { useState } from 'react';
import { UserPlus, MoreVertical, Shield, Ban, CheckCircle, Users as UsersIcon, DollarSign, UserCheck, UserX } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Card, CardContent } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select';
import { Avatar, AvatarFallback } from '@/src/components/ui/avatar';
import { toast } from 'react-toastify';
import { PageHeader } from '@/src/components/custom/pageHeader';
import { StatsCard } from '@/src/components/custom/statsCard';
import { SearchBar } from '@/src/components/custom/searchBar';
import { StatusBadge } from '@/src/components/custom/StatusBadge';
import { DataTable } from '@/src/components/dataTable/dataTable';
import { FormWrapper, FormInput, FormSelect, StatCard } from '@/src/components/custom';
import { UserSchema, UserFormData } from '@/src/schema';
import { User } from '@/src/types';
import { SectionCard } from '@/src/components/custom/sectionCard';
import { StandaloneSelect } from '@/src/components/custom/standaloneSelect';

const users: User[] = [
  { id: 1, name: 'John Smith', email: 'john@example.com', role: 'Premium', status: 'Active', balance: 45230, joinDate: '2024-01-15', transactions: 124 },
  { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', role: 'Standard', status: 'Active', balance: 28900, joinDate: '2024-02-20', transactions: 89 },
  { id: 3, name: 'Mike Brown', email: 'mike@example.com', role: 'Premium', status: 'Active', balance: 67400, joinDate: '2023-11-10', transactions: 256 },
  { id: 4, name: 'Emma Davis', email: 'emma@example.com', role: 'Standard', status: 'Suspended', balance: 12500, joinDate: '2024-03-05', transactions: 45 },
  { id: 5, name: 'Alex Wilson', email: 'alex@example.com', role: 'Enterprise', status: 'Active', balance: 142000, joinDate: '2023-08-22', transactions: 512 },
  { id: 6, name: 'Lisa Anderson', email: 'lisa@example.com', role: 'Premium', status: 'Active', balance: 53200, joinDate: '2024-01-30', transactions: 178 },
  { id: 7, name: 'David Martinez', email: 'david@example.com', role: 'Standard', status: 'Inactive', balance: 8900, joinDate: '2024-04-12', transactions: 23 },
  { id: 8, name: 'Jennifer Lee', email: 'jennifer@example.com', role: 'Enterprise', status: 'Active', balance: 189500, joinDate: '2023-06-18', transactions: 634 },
];

const getRoleBadgeColor = (role: string) => {
  switch (role) {
    case 'Enterprise':
      return 'bg-purple-100 text-purple-700';
    case 'Premium':
      return 'bg-blue-100 text-blue-700';
    case 'Standard':
      return 'bg-gray-100 text-gray-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const roleOptions = [
  { value: 'Standard', label: 'Standard' },
  { value: 'Premium', label: 'Premium' },
  { value: 'Enterprise', label: 'Enterprise' },
];

// Column definitions
export const userColumns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: 'User',
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-emerald-600 text-white">
            {row.getValue<string>('name').split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <div>
          <p>{row.getValue('name')}</p>
          <p className="text-sm text-gray-500">{row.original.email}</p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => (
      <Badge variant="secondary" className={getRoleBadgeColor(row.getValue('role'))}>
        {row.getValue('role')}
      </Badge>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <StatusBadge status={row.getValue('status')} />,
  },
  {
    accessorKey: 'balance',
    header: 'Balance',
    cell: ({ row }) => `$${(row.getValue('balance') as number).toLocaleString()}`,
  },
  {
    accessorKey: 'transactions',
    header: 'Transactions',
    cell: ({ row }) => (
      <span className="text-gray-600">{row.getValue('transactions')}</span>
    ),
  },
  {
    accessorKey: 'joinDate',
    header: 'Join Date',
    cell: ({ row }) => (
      <span className="text-gray-600 text-sm">{row.getValue('joinDate')}</span>
    ),
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" title="View Details">
          <Shield className="w-4 h-4" />
        </Button>
        {row.original.status === 'Active' ? (
          <Button variant="ghost" size="icon" title="Suspend User">
            <Ban className="w-4 h-4 text-red-600" />
          </Button>
        ) : (
          <Button variant="ghost" size="icon" title="Activate User">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </Button>
        )}
        <Button variant="ghost" size="icon">
          <MoreVertical className="w-4 h-4" />
        </Button>
      </div>
    ),
  },
];

export default function Users() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [editingUser, setEditingUser] = useState<User | undefined>(undefined);

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'All' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'All' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleSubmit = async (data: UserFormData) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (editingUser) {
      toast.success('User updated successfully!');
    } else {
      toast.success('User added successfully!');
    }
    
    setIsDialogOpen(false);
    setEditingUser(undefined);
  };

  const handleAddUser = () => {
    setEditingUser(undefined);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="User Management"
        description="Manage user accounts and permissions"
        actionLabel="Add New User"
        actionIcon={UserPlus}
        onAction={handleAddUser}
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={users.length}
          icon={UsersIcon}
          variant="gray"
          size="medium"
        />
        <StatCard
          title="Active Users"
          value={users.filter(u => u.status === 'Active').length}
          icon={UserCheck}
          variant="emerald"
          size="medium"
        />
        <StatCard
          title="Suspended"
          value={users.filter(u => u.status === 'Suspended').length}
          icon={UserX}
          variant="red"
          size="medium"
        />
        <StatCard
          title="Total Balance"
          value={`$${users.reduce((sum, u) => sum + u.balance, 0).toLocaleString()}`}
          icon={DollarSign}
          variant="gray"
          size="medium"
        />
      </div>

      {/* Search and Filters */}
      <SectionCard>
        <div className="flex flex-col sm:flex-row gap-4">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search by name or email..."
          />
          <div className="flex gap-2">
            <StandaloneSelect
              value={roleFilter}
              onValueChange={setRoleFilter}
              label="Role"
              options={[
                { value: 'All', label: 'All Roles' },
                { value: 'Enterprise', label: 'Enterprise' },
                { value: 'Premium', label: 'Premium' },
                { value: 'Standard', label: 'Standard' },
              ]}
            />
            <StandaloneSelect
              value={statusFilter}
              onValueChange={setStatusFilter}
              label="Status"
              options={[
                { value: 'All', label: 'All Status' },
                { value: 'Active', label: 'Active' },
                { value: 'Suspended', label: 'Suspended' },
                { value: 'Inactive', label: 'Inactive' },
              ]}
            />
          </div>
        </div>
      </SectionCard>

      {/* Users Table */}
      <SectionCard title="All Users">
        <DataTable
          columns={userColumns}
          data={filteredUsers}
          showPagination={true}
          paginationOptions={{
            pageSizeOptions: [10, 20, 30, 50],
            showRowsPerPage: true,
            showFirstLastButtons: true,
            showPageInfo: true,
            showSelectedRows: false,
          }}
        />
      </SectionCard>

      {/* User Form Dialog */}
      <FormWrapper
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        entityName="User"
        schema={UserSchema}
        defaultValues={{
          name: '',
          email: '',
          role: 'Standard',
          balance: 0,
        }}
        initialData={editingUser ? {
          name: editingUser.name,
          email: editingUser.email,
          role: editingUser.role,
          balance: editingUser.balance,
        } : undefined}
        onSubmit={handleSubmit}
      >
        {(form) => (
          <>
            <FormInput
              control={form.control}
              name="name"
              label="Full Name"
              placeholder="John Doe"
            />
            <FormInput
              control={form.control}
              name="email"
              label="Email Address"
              type="email"
              placeholder="john.doe@example.com"
            />
            <FormSelect
              control={form.control}
              name="role"
              label="User Role"
              options={roleOptions}
            />
            <FormInput
              control={form.control}
              name="balance"
              label="Initial Balance"
              type="number"
              placeholder="0"
            />
          </>
        )}
      </FormWrapper>
    </div>
  );
}