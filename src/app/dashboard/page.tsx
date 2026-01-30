'use client';

import { useState, useEffect } from 'react';
import { Users, UserCheck, UserX, UserMinus } from 'lucide-react';
import { Card } from '@/src/components/ui/card';
import { DataTable } from '@/src/components/dataTable/dataTable';
import { SectionCard } from '@/src/components/custom/sectionCard';
import { StatCard } from '@/src/components/custom/statCard';
import { createUserColumns, User, ColumnActions } from '@/src/app/dashboard/columns';
import { PageHeader } from '@/src/components/custom/pageHeader';

export default function Overview() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      const result = await response.json();
      if (result.success) {
        // Map the API response to match the User interface if necessary
        // Assuming the API returns data in a similar format or we adapt it here
        const formattedUsers = result.data.map((user: any) => ({
          id: user._id,
          name: user.name,
          username: user.username || '',
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

  const columnActions: ColumnActions = {
    onEdit: (user) => console.log('Edit user', user),
    onDelete: (id) => console.log('Delete user', id),
  };

  const columns = createUserColumns(columnActions);

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'Active').length,
    inactive: users.filter(u => u.status === 'Inactive').length,
    suspended: users.filter(u => u.status === 'Suspended').length,
  };

  if (loading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard Overview"
        description="Welcome to your FMS dashboard."
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={stats.total}
          icon={Users}
          variant="blue"
          size="medium"
        />
        <StatCard
          title="Active Users"
          value={stats.active}
          icon={UserCheck}
          variant="emerald"
          size="medium"
        />
        <StatCard
          title="Inactive Users"
          value={stats.inactive}
          icon={UserX}
          variant="gray"
          size="medium"
        />
        <StatCard
          title="Suspended Users"
          value={stats.suspended}
          icon={UserMinus}
          variant="red"
          size="medium"
        />
      </div>

      {/* All Users Table */}
      <SectionCard title="All Users">
        <DataTable
          columns={columns}
          data={users}
          showPagination={true}
        />
      </SectionCard>
    </div>
  );
}