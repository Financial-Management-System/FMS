'use client';
import { useState } from 'react';
import { Button } from '@/src/components/ui/button';
import { Shield, Plus, Edit, Trash2, Check, X, Users } from 'lucide-react';
import FormDialog from '@/src/components/custom/formDialog';
import { z } from 'zod';
import { roleSchema } from '@/src/schema';
import { cn } from '@/src/components/ui/utils';
import { DataTable } from '@/src/components/dataTable/dataTable';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/src/components/ui/badge';

interface Permission {
  id: string;
  name: string;
  description: string;
  category: 'financial' | 'users' | 'reports' | 'settings';
}

interface Role {
  id: string;
  name: string;
  description: string;
  level: 'Admin' | 'Manager' | 'User' | 'Viewer';
  userCount: number;
  permissions: string[];
}

const availablePermissions: Permission[] = [
  // Financial
  { id: 'view_transactions', name: 'View Transactions', description: 'Can view transaction history', category: 'financial' },
  { id: 'create_transactions', name: 'Create Transactions', description: 'Can create new transactions', category: 'financial' },
  { id: 'approve_expenses', name: 'Approve Expenses', description: 'Can approve expense requests', category: 'financial' },
  { id: 'manage_budgets', name: 'Manage Budgets', description: 'Can create and edit budgets', category: 'financial' },
  { id: 'view_reports', name: 'View Financial Reports', description: 'Can access financial reports', category: 'financial' },
  
  // Users
  { id: 'view_users', name: 'View Users', description: 'Can view user list', category: 'users' },
  { id: 'create_users', name: 'Create Users', description: 'Can add new users', category: 'users' },
  { id: 'edit_users', name: 'Edit Users', description: 'Can modify user information', category: 'users' },
  { id: 'delete_users', name: 'Delete Users', description: 'Can remove users', category: 'users' },
  { id: 'manage_roles', name: 'Manage Roles', description: 'Can create and edit roles', category: 'users' },
  
  // Reports
  { id: 'generate_reports', name: 'Generate Reports', description: 'Can create new reports', category: 'reports' },
  { id: 'export_data', name: 'Export Data', description: 'Can export data to external formats', category: 'reports' },
  { id: 'view_analytics', name: 'View Analytics', description: 'Can access analytics dashboard', category: 'reports' },
  
  // Settings
  { id: 'manage_org', name: 'Manage Organization', description: 'Can edit organization settings', category: 'settings' },
  { id: 'manage_departments', name: 'Manage Departments', description: 'Can create and edit departments', category: 'settings' },
  { id: 'system_settings', name: 'System Settings', description: 'Can configure system settings', category: 'settings' },
];

const mockRoles: Role[] = [
  {
    id: '1',
    name: 'Organization Admin',
    description: 'Full access to all features and settings',
    level: 'Admin',
    userCount: 5,
    permissions: availablePermissions.map(p => p.id)
  },
  {
    id: '2',
    name: 'Finance Manager',
    description: 'Manage financial operations and budgets',
    level: 'Manager',
    userCount: 12,
    permissions: ['view_transactions', 'create_transactions', 'approve_expenses', 'manage_budgets', 'view_reports', 'generate_reports', 'export_data', 'view_analytics']
  },
  {
    id: '3',
    name: 'Department Manager',
    description: 'Manage department budget and team',
    level: 'Manager',
    userCount: 18,
    permissions: ['view_transactions', 'create_transactions', 'view_reports', 'view_users', 'view_analytics']
  },
  {
    id: '4',
    name: 'Employee',
    description: 'Basic access to submit expenses',
    level: 'User',
    userCount: 145,
    permissions: ['view_transactions', 'create_transactions', 'view_reports']
  },
  {
    id: '5',
    name: 'Auditor',
    description: 'Read-only access to financial data',
    level: 'Viewer',
    userCount: 8,
    permissions: ['view_transactions', 'view_reports', 'view_analytics', 'export_data']
  },
];

const formFields = [
  { name: 'name' as const, label: 'Role Name', type: 'text' as const, placeholder: 'e.g., Finance Manager' },
  { name: 'description' as const, label: 'Description', type: 'textarea' as const, placeholder: 'Brief description of the role' },
  { 
    name: 'level' as const, 
    label: 'Access Level', 
    type: 'select' as const, 
    options: ['Admin', 'Manager', 'User', 'Viewer'] 
  },
];

export default function OrgRolesPermissions() {
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [managingPermissions, setManagingPermissions] = useState<Role | null>(null);

  const handleAdd = (data: z.infer<typeof roleSchema>) => {
    const newRole: Role = {
      id: Date.now().toString(),
      name: data.name,
      description: data.description,
      level: data.level,
      userCount: 0,
      permissions: []
    };
    setRoles([...roles, newRole]);
    setIsAddOpen(false);
  };

  const handleEdit = (data: z.infer<typeof roleSchema>) => {
    if (!editingRole) return;
    setRoles(roles.map(role =>
      role.id === editingRole.id
        ? { ...role, ...data }
        : role
    ));
    setEditingRole(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this role? Users with this role will need to be reassigned.')) {
      setRoles(roles.filter(role => role.id !== id));
    }
  };

  const togglePermission = (roleId: string, permissionId: string) => {
    setRoles(roles.map(role => {
      if (role.id === roleId) {
        const hasPermission = role.permissions.includes(permissionId);
        return {
          ...role,
          permissions: hasPermission
            ? role.permissions.filter(p => p !== permissionId)
            : [...role.permissions, permissionId]
        };
      }
      return role;
    }));
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Admin':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'Manager':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'User':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Viewer':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const groupedPermissions = availablePermissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  const columns: ColumnDef<Role>[] = [
    {
      accessorKey: 'name',
      header: 'Role Name',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
            <Shield className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <div className="font-medium">{row.original.name}</div>
            <div className="text-sm text-gray-500">{row.original.description}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'level',
      header: 'Access Level',
      cell: ({ row }) => (
        <Badge className={cn('text-xs', getLevelColor(row.original.level))}>
          {row.original.level}
        </Badge>
      ),
    },
    {
      accessorKey: 'userCount',
      header: 'Users',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-gray-400" />
          <span>{row.original.userCount}</span>
        </div>
      ),
    },
    {
      accessorKey: 'permissions',
      header: 'Permissions',
      cell: ({ row }) => (
        <div className="text-sm text-gray-600">
          {row.original.permissions.length} permission(s)
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setManagingPermissions(row.original)}
          >
            <Shield className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setEditingRole(row.original)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(row.original.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl">Roles & Permissions</h2>
          <p className="text-gray-600">Manage user roles and access controls</p>
        </div>
        <Button onClick={() => setIsAddOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Role
        </Button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-600 mb-1">Total Roles</div>
          <div className="text-2xl font-semibold">{roles.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-600 mb-1">Admin Roles</div>
          <div className="text-2xl font-semibold">{roles.filter(r => r.level === 'Admin').length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-600 mb-1">Manager Roles</div>
          <div className="text-2xl font-semibold">{roles.filter(r => r.level === 'Manager').length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-600 mb-1">Assigned Users</div>
          <div className="text-2xl font-semibold">{roles.reduce((sum, r) => sum + r.userCount, 0)}</div>
        </div>
      </div>

      {/* Roles DataTable */}
      <DataTable
        columns={columns}
        data={roles}
        showPagination={true}
        paginationOptions={{
          pageSizeOptions: [5, 10, 20],
          showRowsPerPage: true,
          showPageInfo: true
        }}
        toolbar={(table) => (
          <div className="flex items-center justify-between w-full">
            <div className="text-sm text-gray-600">
              {table.getFilteredRowModel().rows.length} role(s) found
            </div>
          </div>
        )}
      />

      {/* Permission Management Dialog */}
      {managingPermissions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Manage Permissions - {managingPermissions.name}</h3>
              <Button variant="ghost" size="sm" onClick={() => setManagingPermissions(null)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-6">
              {Object.entries(groupedPermissions).map(([category, permissions]) => (
                <div key={category} className="border rounded-lg p-4">
                  <h4 className="font-medium mb-3 capitalize">{category} Permissions</h4>
                  <div className="grid md:grid-cols-2 gap-3">
                    {permissions.map((permission) => {
                      const isChecked = managingPermissions.permissions.includes(permission.id);
                      return (
                        <div key={permission.id} className="flex items-start gap-3 p-3 border rounded-lg">
                          <button
                            onClick={() => togglePermission(managingPermissions.id, permission.id)}
                            className={cn(
                              'w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5',
                              isChecked
                                ? 'bg-emerald-500 border-emerald-500 text-white'
                                : 'border-gray-300 hover:border-emerald-400'
                            )}
                          >
                            {isChecked && <Check className="w-3 h-3" />}
                          </button>
                          <div className="flex-1">
                            <div className="font-medium text-sm">{permission.name}</div>
                            <div className="text-xs text-gray-500">{permission.description}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setManagingPermissions(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Role Dialog */}
      <FormDialog
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        title="Create New Role"
        description="Add a new role with specific permissions"
        fields={formFields}
        schema={roleSchema}
        onSubmit={handleAdd}
      />

      {/* Edit Role Dialog */}
      <FormDialog
        open={!!editingRole}
        onOpenChange={(open) => !open && setEditingRole(null)}
        title="Edit Role"
        description="Update role information"
        fields={formFields}
        schema={roleSchema}
        defaultValues={editingRole || undefined}
        onSubmit={handleEdit}
      />
    </div>
  );
}