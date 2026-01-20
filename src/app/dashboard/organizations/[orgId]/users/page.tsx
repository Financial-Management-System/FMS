"use client";

import { useState } from 'react';
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



const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@acme.com',
    role: 'Engineering Manager',
    department: 'Engineering',
    phone: '+1 (555) 001-0001',
    status: 'Active',
    joinedDate: '2023-01-15',
    lastActive: '2025-12-14'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@acme.com',
    role: 'Marketing Director',
    department: 'Marketing',
    phone: '+1 (555) 001-0002',
    status: 'Active',
    joinedDate: '2023-02-20',
    lastActive: '2025-12-14'
  },
  {
    id: '3',
    name: 'Michael Brown',
    email: 'michael.b@acme.com',
    role: 'Sales Manager',
    department: 'Sales',
    phone: '+1 (555) 001-0003',
    status: 'Active',
    joinedDate: '2023-03-10',
    lastActive: '2025-12-13'
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily.d@acme.com',
    role: 'Financial Analyst',
    department: 'Finance',
    phone: '+1 (555) 001-0004',
    status: 'Active',
    joinedDate: '2023-04-05',
    lastActive: '2025-12-14'
  },
  {
    id: '5',
    name: 'David Wilson',
    email: 'david.w@acme.com',
    role: 'HR Manager',
    department: 'Human Resources',
    phone: '+1 (555) 001-0005',
    status: 'Inactive',
    joinedDate: '2023-05-12',
    lastActive: '2025-11-20'
  },
  {
    id: '6',
    name: 'Lisa Anderson',
    email: 'lisa.a@acme.com',
    role: 'Product Designer',
    department: 'Design',
    phone: '+1 (555) 001-0006',
    status: 'Active',
    joinedDate: '2023-06-18',
    lastActive: '2025-12-14'
  },
  {
    id: '7',
    name: 'Robert Taylor',
    email: 'robert.t@acme.com',
    role: 'DevOps Engineer',
    department: 'Engineering',
    phone: '+1 (555) 001-0007',
    status: 'Active',
    joinedDate: '2023-07-22',
    lastActive: '2025-12-13'
  },
  {
    id: '8',
    name: 'Jennifer Martinez',
    email: 'jennifer.m@acme.com',
    role: 'Content Strategist',
    department: 'Marketing',
    phone: '+1 (555) 001-0008',
    status: 'Active',
    joinedDate: '2023-08-30',
    lastActive: '2025-12-14'
  },
  {
    id: '9',
    name: 'Christopher Lee',
    email: 'chris.l@acme.com',
    role: 'Sales Representative',
    department: 'Sales',
    phone: '+1 (555) 001-0009',
    status: 'Suspended',
    joinedDate: '2023-09-14',
    lastActive: '2025-10-05'
  },
  {
    id: '10',
    name: 'Amanda White',
    email: 'amanda.w@acme.com',
    role: 'Accountant',
    department: 'Finance',
    phone: '+1 (555) 001-0010',
    status: 'Active',
    joinedDate: '2023-10-25',
    lastActive: '2025-12-14'
  },
  {
    id: '11',
    name: 'James Garcia',
    email: 'james.g@acme.com',
    role: 'Software Engineer',
    department: 'Engineering',
    phone: '+1 (555) 001-0011',
    status: 'Active',
    joinedDate: '2023-11-08',
    lastActive: '2025-12-14'
  },
  {
    id: '12',
    name: 'Patricia Rodriguez',
    email: 'patricia.r@acme.com',
    role: 'Recruiter',
    department: 'Human Resources',
    phone: '+1 (555) 001-0012',
    status: 'Active',
    joinedDate: '2023-12-03',
    lastActive: '2025-12-13'
  },
  {
    id: '13',
    name: 'Daniel Hernandez',
    email: 'daniel.h@acme.com',
    role: 'UX Designer',
    department: 'Design',
    phone: '+1 (555) 001-0013',
    status: 'Active',
    joinedDate: '2024-01-20',
    lastActive: '2025-12-14'
  },
  {
    id: '14',
    name: 'Jessica Lopez',
    email: 'jessica.l@acme.com',
    role: 'Marketing Specialist',
    department: 'Marketing',
    phone: '+1 (555) 001-0014',
    status: 'Inactive',
    joinedDate: '2024-02-12',
    lastActive: '2025-11-15'
  },
  {
    id: '15',
    name: 'Matthew Gonzalez',
    email: 'matthew.g@acme.com',
    role: 'Senior Developer',
    department: 'Engineering',
    phone: '+1 (555) 001-0015',
    status: 'Active',
    joinedDate: '2024-03-05',
    lastActive: '2025-12-14'
  },
];

const formFields = [
  { name: 'name' as const, label: 'Full Name', type: 'text' as const, placeholder: 'e.g., John Doe' },
  { name: 'email' as const, label: 'Email Address', type: 'email' as const, placeholder: 'john.doe@example.com' },
  { name: 'role' as const, label: 'Job Role', type: 'text' as const, placeholder: 'e.g., Senior Developer' },
  { name: 'department' as const, label: 'Department', type: 'text' as const, placeholder: 'e.g., Engineering' },
  { name: 'phone' as const, label: 'Phone Number', type: 'tel' as const, placeholder: '+1 (555) 000-0000' },
  { 
    name: 'status' as const, 
    label: 'Status', 
    type: 'select' as const, 
    options: ['Active', 'Inactive', 'Suspended'] 
  },
];

const ITEMS_PER_PAGE = 10;

export default function OrgUsersManagement() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [departmentFilter, setDepartmentFilter] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const handleAdd = (data: z.infer<typeof userManagementSchema>) => {
    const newUser: User = {
      id: Date.now().toString(),
      name: data.name,
      email: data.email,
      role: data.role,
      department: data.department,
      phone: data.phone || '',
      status: data.status,
      joinedDate: new Date().toISOString().split('T')[0],
      lastActive: new Date().toISOString().split('T')[0]
    };
    setUsers([newUser, ...users]);
    setIsAddOpen(false);
  };

  const handleEdit = (data: z.infer<typeof userManagementSchema>) => {
    if (!editingUser) return;
    setUsers(users.map(user =>
      user.id === editingUser.id
        ? { ...user, ...data, phone: data.phone || '' }
        : user
    ));
    setEditingUser(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this user?')) {
      setUsers(users.filter(user => user.id !== id));
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
        fields={formFields}
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
          fields={formFields}
          defaultValues={{
            name: editingUser.name,
            email: editingUser.email,
            role: editingUser.role,
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