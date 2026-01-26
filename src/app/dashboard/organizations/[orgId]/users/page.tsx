"use client";

import { useState, useEffect, use } from 'react';
import { Card } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Users, Plus, Search, UserCheck, UserX, UserMinus, Filter } from 'lucide-react';

import { z } from 'zod';
import { userManagementSchema } from '@/src/schema';
import FormDialog from '@/src/components/custom/formDialog';
import { createUserColumns, User, ColumnActions } from './columns';
import { DataTable } from '@/src/components/dataTable/dataTable';
import { StatCard } from '@/src/components/custom/statCard';

const formFields = [
  { name: 'name' as const, label: 'Full Name', type: 'text' as const, placeholder: 'e.g., John Doe' },
  { name: 'email' as const, label: 'Email Address', type: 'email' as const, placeholder: 'john.doe@example.com' },
  { name: 'password' as const, label: 'Password', type: 'password' as const, placeholder: 'Enter password' },
  { 
    name: 'role' as const, 
    label: 'Role', 
    type: 'select' as const, 
    options: ['Standard', 'Premium', 'Enterprise'] 
  },
  { name: 'department' as const, label: 'Department', type: 'text' as const, placeholder: 'e.g., Engineering' },
  { name: 'phone' as const, label: 'Phone Number', type: 'text' as const, placeholder: '+1 (555) 000-0000' },
  { 
    name: 'status' as const, 
    label: 'Status', 
    type: 'select' as const, 
    options: ['Active', 'Inactive', 'Suspended'] 
  },
];

const ITEMS_PER_PAGE = 10;

export default function OrgUsersManagement({ params }: { params: Promise<{ orgId: string }> }) {
  const resolvedParams = use(params);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [departmentFilter, setDepartmentFilter] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`/api/users?organizationId=${resolvedParams.orgId}`);
      const result = await response.json();
      if (result.success) {
        const formattedUsers = result.data.map((user: any) => ({
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department || '',
          phone: user.phone || '',
          status: user.status,
          joinedDate: user.joinDate ? user.joinDate.split('T')[0] : '',
          lastActive: user.updatedAt ? user.updatedAt.split('T')[0] : ''
        }));
        setUsers(formattedUsers);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (data: z.infer<typeof userManagementSchema>) => {
    try {
      console.log('Sending user data:', data);
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, organizationId: resolvedParams.orgId })
      });
      const result = await response.json();
      console.log('API response:', result);
      if (result.success) {
        fetchUsers();
        setIsAddOpen(false);
      } else {
        console.error('API error:', result.error);
        alert('Failed to add user: ' + result.error);
      }
    } catch (error) {
      console.error('Failed to add user:', error);
      alert('Failed to add user: ' + error);
    }
  };

  const handleEdit = async (data: z.infer<typeof userManagementSchema>) => {
    if (!editingUser) return;
    try {
      const response = await fetch(`/api/users/${editingUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      if (result.success) {
        fetchUsers();
        setEditingUser(null);
      }
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to remove this user?')) {
      try {
        const response = await fetch(`/api/users/${id}`, {
          method: 'DELETE'
        });
        const result = await response.json();
        if (result.success) {
          fetchUsers();
        }
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  };

  // Get unique departments
  const departments = ['All', ...Array.from(new Set(users.map(u => u.department)))];

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || user.status === statusFilter;
    const matchesDepartment = departmentFilter === 'All' || user.department === departmentFilter;
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const columnActions: ColumnActions = {
    onEdit: setEditingUser,
    onDelete: handleDelete
  };

  const columns = createUserColumns(columnActions);

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'Active').length,
    inactive: users.filter(u => u.status === 'Inactive').length,
    suspended: users.filter(u => u.status === 'Suspended').length,
  };

  if (loading) {
    return <div className="p-6">Loading users...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl text-gray-900">Users Management</h2>
          <p className="text-gray-600 mt-1">Manage team members and access</p>
        </div>
        <Button onClick={() => setIsAddOpen(true)} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={stats.total}
          icon={Users}
          variant="blue"
        />
        <StatCard
          title="Active"
          value={stats.active}
          icon={UserCheck}
          variant="emerald"
        />
        <StatCard
          title="Inactive"
          value={stats.inactive}
          icon={UserX}
          variant="gray"
        />
        <StatCard
          title="Suspended"
          value={stats.suspended}
          icon={UserMinus}
          variant="red"
        />
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by name, email, role, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Status:</span>
              <div className="flex gap-2">
                {['All', 'Active', 'Inactive', 'Suspended'].map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setStatusFilter(status);
                      setCurrentPage(1);
                    }}
                    className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                      statusFilter === status
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Department:</span>
              <select
                value={departmentFilter}
                onChange={(e) => {
                  setDepartmentFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1}-{Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} users
          </div>
        </div>
      </Card>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={currentUsers}
        showPagination={totalPages > 1}
        manualPagination={true}
        pageCount={totalPages}
        paginationState={{
          pageIndex: currentPage - 1,
          pageSize: ITEMS_PER_PAGE
        }}
        onPaginationChange={(updater) => {
          const newState = typeof updater === 'function' 
            ? updater({ pageIndex: currentPage - 1, pageSize: ITEMS_PER_PAGE })
            : updater;
          setCurrentPage(newState.pageIndex + 1);
        }}
        paginationOptions={{
          showRowsPerPage: false,
          showPageInfo: true
        }}
      />

      {/* Add User Dialog */}
      <FormDialog
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleAdd}
        title="Add New User"
        description="Add a new team member to your organization"
        schema={userManagementSchema}
        fields={formFields as any}
        submitLabel="Add User"
      />

      {/* Edit User Dialog */}
      {editingUser && (
        <FormDialog
          open={!!editingUser}
          onClose={() => setEditingUser(null)}
          onSubmit={handleEdit}
          title="Edit User"
          description="Update user information"
          schema={userManagementSchema}
          fields={formFields as any}
          defaultValues={{
            name: editingUser.name,
            email: editingUser.email,
            password: '', // Don't show existing password
            role: editingUser.role as 'Standard' | 'Premium' | 'Enterprise',
            department: editingUser.department,
            phone: editingUser.phone,
            status: editingUser.status,
          }}
          submitLabel="Save Changes"
        />
      )}
    </div>
  );
}