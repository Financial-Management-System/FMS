'use client';
import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/src/components/ui/button';
import { Shield, Plus, Check, X } from 'lucide-react';
import { DataTable } from '@/src/components/dataTable/dataTable';
import { useParams } from 'next/navigation';
import { createRoleColumns, Role } from './columns.tsx';
import { z } from 'zod';

interface Permission {
  id: string;
  name: string;
  module: 'employees' | 'departments' | 'budgets' | 'expenses' | 'income' | 'transactions' | 'payroll' | 'reports' | 'analytics' | 'approvals' | 'recurring' | 'auditLogs' | 'notifications' | 'system';
}

const modulePermissions = {
  employees: [
    { id: 'employees_view', name: 'View', module: 'employees' as const },
    { id: 'employees_create', name: 'Create', module: 'employees' as const },
    { id: 'employees_edit', name: 'Edit', module: 'employees' as const },
    { id: 'employees_delete', name: 'Delete', module: 'employees' as const },
  ],
  departments: [
    { id: 'departments_view', name: 'View', module: 'departments' as const },
    { id: 'departments_create', name: 'Create', module: 'departments' as const },
    { id: 'departments_edit', name: 'Edit', module: 'departments' as const },
    { id: 'departments_delete', name: 'Delete', module: 'departments' as const },
  ],
  budgets: [
    { id: 'budgets_view', name: 'View', module: 'budgets' as const },
    { id: 'budgets_create', name: 'Create', module: 'budgets' as const },
    { id: 'budgets_edit', name: 'Edit', module: 'budgets' as const },
    { id: 'budgets_delete', name: 'Delete', module: 'budgets' as const },
    { id: 'budgets_monitor', name: 'Monitor', module: 'budgets' as const },
  ],
  expenses: [
    { id: 'expenses_view', name: 'View', module: 'expenses' as const },
    { id: 'expenses_create', name: 'Create', module: 'expenses' as const },
    { id: 'expenses_edit', name: 'Edit', module: 'expenses' as const },
    { id: 'expenses_delete', name: 'Delete', module: 'expenses' as const },
  ],
  income: [
    { id: 'income_view', name: 'View', module: 'income' as const },
    { id: 'income_create', name: 'Create', module: 'income' as const },
    { id: 'income_edit', name: 'Edit', module: 'income' as const },
    { id: 'income_delete', name: 'Delete', module: 'income' as const },
  ],
  transactions: [
    { id: 'transactions_view', name: 'View', module: 'transactions' as const },
    { id: 'transactions_create', name: 'Create', module: 'transactions' as const },
    { id: 'transactions_edit', name: 'Edit', module: 'transactions' as const },
    { id: 'transactions_delete', name: 'Delete', module: 'transactions' as const },
  ],
  payroll: [
    { id: 'payroll_view', name: 'View', module: 'payroll' as const },
    { id: 'payroll_create', name: 'Create', module: 'payroll' as const },
    { id: 'payroll_edit', name: 'Edit', module: 'payroll' as const },
    { id: 'payroll_process', name: 'Process', module: 'payroll' as const },
  ],
  reports: [
    { id: 'reports_view', name: 'View', module: 'reports' as const },
    { id: 'reports_generate', name: 'Generate', module: 'reports' as const },
    { id: 'reports_export', name: 'Export', module: 'reports' as const },
  ],
  analytics: [
    { id: 'analytics_view', name: 'View', module: 'analytics' as const },
    { id: 'analytics_dashboard', name: 'Dashboard', module: 'analytics' as const },
  ],
  approvals: [
    { id: 'approvals_view', name: 'View', module: 'approvals' as const },
    { id: 'approvals_approve', name: 'Approve', module: 'approvals' as const },
    { id: 'approvals_reject', name: 'Reject', module: 'approvals' as const },
    { id: 'approvals_rules', name: 'Manage Rules', module: 'approvals' as const },
  ],
  recurring: [
    { id: 'recurring_view', name: 'View', module: 'recurring' as const },
    { id: 'recurring_create', name: 'Create', module: 'recurring' as const },
    { id: 'recurring_edit', name: 'Edit', module: 'recurring' as const },
    { id: 'recurring_delete', name: 'Delete', module: 'recurring' as const },
  ],
  auditLogs: [
    { id: 'auditLogs_view', name: 'View', module: 'auditLogs' as const },
    { id: 'auditLogs_export', name: 'Export', module: 'auditLogs' as const },
  ],
  notifications: [
    { id: 'notifications_view', name: 'View', module: 'notifications' as const },
    { id: 'notifications_send', name: 'Send', module: 'notifications' as const },
    { id: 'notifications_manage', name: 'Manage', module: 'notifications' as const },
  ],
  system: [
    { id: 'system_settings', name: 'Settings', module: 'system' as const },
    { id: 'system_orgManagement', name: 'Org Management', module: 'system' as const },
    { id: 'system_currency', name: 'Currency', module: 'system' as const },
    { id: 'system_backup', name: 'Backup', module: 'system' as const },
  ]
};

const allPermissions = Object.values(modulePermissions).flat();

const roleSchema = z.object({
  name: z.string().min(1, 'Role name is required'),
  description: z.string().optional(),
  status: z.enum(['Active', 'Inactive']).default('Active')
});

export default function RolesPage() {
  const params = useParams();
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [managingPermissions, setManagingPermissions] = useState<Role | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [permissionSearch, setPermissionSearch] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [formData, setFormData] = useState({ name: '', description: '', status: 'Active' });

  useEffect(() => {
    fetchRoles();
  }, [params.orgId]);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/roles?orgId=${params.orgId}`);
      const data = await response.json();
      if (data.success) {
        setRoles(data.data);
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    try {
      const response = await fetch('/api/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, orgId: params.orgId, permissions: selectedPermissions })
      });
      if (response.ok) {
        await fetchRoles();
        setIsAddOpen(false);
        setSelectedPermissions([]);
        setFormData({ name: '', description: '', status: 'Active' });
      }
    } catch (error) {
      console.error('Error creating role:', error);
    }
  };

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    setFormData({ name: role.name, description: role.description || '', status: role.status });
    setSelectedPermissions(role.permissions || []);
  };

  const handleUpdate = async () => {
    if (!editingRole) return;
    try {
      const response = await fetch(`/api/roles/${editingRole._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, permissions: selectedPermissions })
      });
      if (response.ok) {
        await fetchRoles();
        setEditingRole(null);
        setFormData({ name: '', description: '', status: 'Active' });
        setSelectedPermissions([]);
      }
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this role?')) {
      try {
        const response = await fetch(`/api/roles/${id}`, { method: 'DELETE' });
        if (response.ok) {
          await fetchRoles();
        }
      } catch (error) {
        console.error('Error deleting role:', error);
      }
    }
  };

  const handleManagePermissions = (role: Role) => {
    setManagingPermissions(role);
    setSelectedPermissions(role.permissions || []);
  };

  const togglePermission = (permissionId: string) => {
    setSelectedPermissions(prev => 
      prev.includes(permissionId)
        ? prev.filter(p => p !== permissionId)
        : [...prev, permissionId]
    );
  };

  const toggleModulePermissions = (module: keyof typeof modulePermissions) => {
    const modulePerms = modulePermissions[module].map(p => p.id);
    const allSelected = modulePerms.every(p => selectedPermissions.includes(p));
    
    setSelectedPermissions(prev => 
      allSelected
        ? prev.filter(p => !modulePerms.includes(p))
        : [...prev.filter(p => !modulePerms.includes(p)), ...modulePerms]
    );
  };

  const toggleAllPermissions = () => {
    const allPerms = allPermissions.map(p => p.id);
    const allSelected = allPerms.every(p => selectedPermissions.includes(p));
    setSelectedPermissions(allSelected ? [] : allPerms);
  };

  const setReadOnlyPreset = () => {
    setSelectedPermissions([
      'employees_view', 'departments_view', 'budgets_view', 'expenses_view', 
      'income_view', 'transactions_view', 'reports_view', 'analytics_view'
    ]);
  };

  const savePermissions = async () => {
    if (!managingPermissions) return;
    try {
      const response = await fetch(`/api/roles/${managingPermissions._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ permissions: selectedPermissions })
      });
      if (response.ok) {
        await fetchRoles();
        setManagingPermissions(null);
        setSelectedPermissions([]);
      }
    } catch (error) {
      console.error('Error updating permissions:', error);
    }
  };

  const filteredPermissions = useMemo(() => {
    if (!permissionSearch) return allPermissions;
    return allPermissions.filter(p => 
      p.name.toLowerCase().includes(permissionSearch.toLowerCase()) ||
      p.module.toLowerCase().includes(permissionSearch.toLowerCase())
    );
  }, [permissionSearch]);

  const isModuleFullySelected = (module: keyof typeof modulePermissions) => {
    return modulePermissions[module].every(p => selectedPermissions.includes(p.id));
  };

  const isAllSelected = allPermissions.every(p => selectedPermissions.includes(p.id));

  const columns = createRoleColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
    onManagePermissions: handleManagePermissions
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Roles & Permissions</h2>
          <p className="text-gray-600">Manage user roles and access controls</p>
        </div>
        <Button onClick={() => setIsAddOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Role
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-600 mb-1">Total Roles</div>
          <div className="text-2xl font-semibold">{roles.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-600 mb-1">Active Roles</div>
          <div className="text-2xl font-semibold">{roles.filter(r => r.status === 'Active').length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-600 mb-1">Inactive Roles</div>
          <div className="text-2xl font-semibold">{roles.filter(r => r.status === 'Inactive').length}</div>
        </div>
      </div>

      <DataTable 
        columns={columns} 
        data={roles} 
        loading={loading}
      />

      {/* Add Role Dialog */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Create New Role</h3>
              <Button variant="ghost" size="sm" onClick={() => { setIsAddOpen(false); setSelectedPermissions([]); setFormData({ name: '', description: '', status: 'Active' }); }}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1">Role Name</label>
                <input 
                  type="text" 
                  className="w-full border rounded-md px-3 py-2"
                  placeholder="Enter role name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description (optional)</label>
                <textarea 
                  className="w-full border rounded-md px-3 py-2"
                  placeholder="Role description"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select 
                  className="w-full border rounded-md px-3 py-2"
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Permissions Section */}
            <div className="border-t pt-4">
              <h4 className="font-medium mb-4">Permissions</h4>
              
              {/* Global Controls */}
              <div className="flex gap-2 mb-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={toggleAllPermissions}
                >
                  <Check className="w-4 h-4 mr-1" />
                  {isAllSelected ? 'Deselect All' : 'Select All Permissions'}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={setReadOnlyPreset}
                >
                  Read-only Preset
                </Button>
              </div>

              {/* Search */}
              <input
                type="text"
                placeholder="Search permissions..."
                className="w-full border rounded-md px-3 py-2 mb-4"
                value={permissionSearch}
                onChange={(e) => setPermissionSearch(e.target.value)}
              />

              {/* Modules */}
              <div className="space-y-4">
                {Object.entries(modulePermissions).map(([moduleKey, permissions]) => (
                  <div key={moduleKey} className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <input
                        type="checkbox"
                        checked={isModuleFullySelected(moduleKey as keyof typeof modulePermissions)}
                        onChange={() => toggleModulePermissions(moduleKey as keyof typeof modulePermissions)}
                        className="rounded"
                      />
                      <span className="font-medium">Select all {moduleKey.charAt(0).toUpperCase() + moduleKey.slice(1)}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 ml-6">
                      {permissions.map(permission => (
                        <label key={permission.id} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedPermissions.includes(permission.id)}
                            onChange={() => togglePermission(permission.id)}
                            className="rounded"
                          />
                          <span>{permission.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => { setIsAddOpen(false); setSelectedPermissions([]); setFormData({ name: '', description: '', status: 'Active' }); }}>
                Cancel
              </Button>
              <Button onClick={handleAdd}>
                Create Role
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Role Dialog */}
      {editingRole && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Edit Role - {editingRole.name}</h3>
              <Button variant="ghost" size="sm" onClick={() => { setEditingRole(null); setFormData({ name: '', description: '', status: 'Active' }); }}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1">Role Name</label>
                <input 
                  type="text" 
                  className="w-full border rounded-md px-3 py-2"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea 
                  className="w-full border rounded-md px-3 py-2"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select 
                  className="w-full border rounded-md px-3 py-2" 
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Permissions Section */}
            <div className="border-t pt-4">
              <h4 className="font-medium mb-4">Permissions</h4>
              
              {/* Global Controls */}
              <div className="flex gap-2 mb-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={toggleAllPermissions}
                >
                  <Check className="w-4 h-4 mr-1" />
                  {isAllSelected ? 'Deselect All' : 'Select All Permissions'}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={setReadOnlyPreset}
                >
                  Read-only Preset
                </Button>
              </div>

              {/* Search */}
              <input
                type="text"
                placeholder="Search permissions..."
                className="w-full border rounded-md px-3 py-2 mb-4"
                value={permissionSearch}
                onChange={(e) => setPermissionSearch(e.target.value)}
              />

              {/* Modules */}
              <div className="space-y-4">
                {Object.entries(modulePermissions).map(([moduleKey, permissions]) => (
                  <div key={moduleKey} className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <input
                        type="checkbox"
                        checked={isModuleFullySelected(moduleKey as keyof typeof modulePermissions)}
                        onChange={() => toggleModulePermissions(moduleKey as keyof typeof modulePermissions)}
                        className="rounded"
                      />
                      <span className="font-medium">Select all {moduleKey.charAt(0).toUpperCase() + moduleKey.slice(1)}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 ml-6">
                      {permissions.map(permission => (
                        <label key={permission.id} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedPermissions.includes(permission.id)}
                            onChange={() => togglePermission(permission.id)}
                            className="rounded"
                          />
                          <span>{permission.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => { setEditingRole(null); setFormData({ name: '', description: '', status: 'Active' }); }}>
                Cancel
              </Button>
              <Button onClick={handleUpdate}>
                Update Role
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Manage Permissions Dialog */}
      {managingPermissions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Manage Permissions - {managingPermissions.name}</h3>
            
            {/* Global Controls */}
            <div className="flex gap-2 mb-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={toggleAllPermissions}
              >
                <Check className="w-4 h-4 mr-1" />
                {isAllSelected ? 'Deselect All' : 'Select All Permissions'}
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={setReadOnlyPreset}
              >
                Read-only Preset
              </Button>
            </div>

            {/* Search */}
            <input
              type="text"
              placeholder="Search permissions..."
              className="w-full border rounded-md px-3 py-2 mb-4"
              value={permissionSearch}
              onChange={(e) => setPermissionSearch(e.target.value)}
            />

            {/* Modules */}
            <div className="space-y-4">
              {Object.entries(modulePermissions).map(([moduleKey, permissions]) => (
                <div key={moduleKey} className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <input
                      type="checkbox"
                      checked={isModuleFullySelected(moduleKey as keyof typeof modulePermissions)}
                      onChange={() => toggleModulePermissions(moduleKey as keyof typeof modulePermissions)}
                      className="rounded"
                    />
                    <span className="font-medium">Select all {moduleKey.charAt(0).toUpperCase() + moduleKey.slice(1)}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 ml-6">
                    {permissions.map(permission => (
                      <label key={permission.id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedPermissions.includes(permission.id)}
                          onChange={() => togglePermission(permission.id)}
                          className="rounded"
                        />
                        <span>{permission.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => { setManagingPermissions(null); setSelectedPermissions([]); }}>
                Cancel
              </Button>
              <Button onClick={savePermissions}>
                Save Permissions
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}