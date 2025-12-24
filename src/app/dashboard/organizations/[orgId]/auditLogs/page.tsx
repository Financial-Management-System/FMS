'use client';

import { use, useState } from 'react';
import { Card } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { FileText, User, Calendar, Filter, Search } from 'lucide-react';

interface AuditLog {
  id: string;
  action: string;
  user: string;
  entity: string;
  details: string;
  timestamp: string;
  ipAddress: string;
  status: 'Success' | 'Failed' | 'Warning';
}

const mockLogs: AuditLog[] = [
  {
    id: '1',
    action: 'Budget Created',
    user: 'John Smith',
    entity: 'Budget',
    details: 'Created Q1 2025 Engineering Budget ($250,000)',
    timestamp: '2025-12-14 10:35 AM',
    ipAddress: '192.168.1.100',
    status: 'Success'
  },
  {
    id: '2',
    action: 'Approval Granted',
    user: 'Sarah Johnson',
    entity: 'Approval',
    details: 'Approved expense request #2547 for $12,500',
    timestamp: '2025-12-14 10:22 AM',
    ipAddress: '192.168.1.105',
    status: 'Success'
  },
  {
    id: '3',
    action: 'User Access Changed',
    user: 'Admin',
    entity: 'User',
    details: 'Modified permissions for Michael Brown',
    timestamp: '2025-12-14 09:15 AM',
    ipAddress: '192.168.1.1',
    status: 'Success'
  },
  {
    id: '4',
    action: 'Payment Processed',
    user: 'Finance Team',
    entity: 'Payment',
    details: 'Processed payroll payment for Engineering team ($285,000)',
    timestamp: '2025-12-14 08:45 AM',
    ipAddress: '192.168.1.110',
    status: 'Success'
  },
  {
    id: '5',
    action: 'Login Attempt Failed',
    user: 'Unknown',
    entity: 'Security',
    details: 'Failed login attempt for admin@company.com',
    timestamp: '2025-12-14 03:12 AM',
    ipAddress: '203.45.67.89',
    status: 'Failed'
  },
  {
    id: '6',
    action: 'Budget Modified',
    user: 'Emily Davis',
    entity: 'Budget',
    details: 'Updated Marketing Q1 budget from $140,000 to $150,000',
    timestamp: '2025-12-13 04:30 PM',
    ipAddress: '192.168.1.120',
    status: 'Success'
  },
  {
    id: '7',
    action: 'Report Generated',
    user: 'John Smith',
    entity: 'Report',
    details: 'Generated Financial Summary Report for Q4 2024',
    timestamp: '2025-12-13 02:15 PM',
    ipAddress: '192.168.1.100',
    status: 'Success'
  }
];

export default function OrgAuditLogs() {
  const [logs] = useState<AuditLog[]>(mockLogs);
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = logs.filter(log => {
    const matchesStatus = filterStatus === 'All' || log.status === filterStatus;
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.details.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Success': return 'bg-emerald-100 text-emerald-800';
      case 'Failed': return 'bg-red-100 text-red-800';
      case 'Warning': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl text-gray-900">Audit Logs</h2>
          <p className="mt-1 text-gray-600">View system activity and changes</p>
        </div>
        <Button variant="outline">
          <FileText className="w-4 h-4 mr-2" />
          Export Logs
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card className="p-4">
          <p className="text-sm text-gray-600">Total Events</p>
          <p className="mt-1 text-2xl">{logs.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Successful</p>
          <p className="mt-1 text-2xl text-emerald-600">
            {logs.filter(l => l.status === 'Success').length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Failed</p>
          <p className="mt-1 text-2xl text-red-600">
            {logs.filter(l => l.status === 'Failed').length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Today</p>
          <p className="mt-1 text-2xl">{logs.filter(l => l.timestamp.includes('2025-12-14')).length}</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
              <input
                type="text"
                placeholder="Search logs..."
                className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Filter className="w-5 h-5 mt-2 text-gray-400" />
            {['All', 'Success', 'Failed', 'Warning'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  filterStatus === status
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Logs List */}
      <div className="space-y-3">
        {filteredLogs.map((log) => (
          <Card key={log.id} className="p-4 transition-shadow hover:shadow-md">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`px-3 py-1 rounded-full text-xs ${getStatusColor(log.status)}`}>
                    {log.status}
                  </div>
                  <h4 className="text-gray-900">{log.action}</h4>
                </div>
                <p className="mb-2 text-sm text-gray-600">{log.details}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>{log.user}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{log.timestamp}</span>
                  </div>
                  <span>IP: {log.ipAddress}</span>
                  <span>Entity: {log.entity}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
