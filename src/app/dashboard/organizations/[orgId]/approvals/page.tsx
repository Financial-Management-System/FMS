'use client';

import { useState } from 'react';
import { Card } from '@/src/components/ui/card';
import { SectionCard } from '@/src/components/custom/sectionCard';
import { Button } from '@/src/components/ui/button';
import { CheckCircle, XCircle, Clock, AlertCircle, Plus, Eye, MessageSquare, User, Calendar } from 'lucide-react';
import FormDialog from '@/src/components/custom/formDialog';
import { FormWrapper } from '@/src/components/custom/formWrapper';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/src/components/ui/form';
import { Textarea } from '@/src/components/ui/textarea';
import { z } from 'zod';
import { approvalSchema } from '@/src/schema';
import { DataTable } from '@/src/components/dataTable/dataTable';
import { DataTableFilter } from '@/src/components/dataTable/dataTableFilter';
import { createColumns } from './columns';

interface Approval {
  id: string;
  requestType: 'Budget' | 'Expense' | 'Payment' | 'Transfer' | 'Purchase' | 'Contract';
  amount: number;
  department: string;
  description: string;
  justification: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Pending' | 'Approved' | 'Rejected' | 'Under Review';
  requestedBy: string;
  requestedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  comments?: string;
}

const mockApprovals: Approval[] = [
  {
    id: '1',
    requestType: 'Budget',
    amount: 150000,
    department: 'Engineering',
    description: 'Additional budget allocation for Q1 2025 infrastructure upgrades',
    justification: 'Current infrastructure is reaching capacity. Need to upgrade servers and cloud resources to support 50% expected user growth in Q1.',
    priority: 'High',
    status: 'Pending',
    requestedBy: 'John Smith',
    requestedAt: '2025-12-12 09:30 AM',
  },
  {
    id: '2',
    requestType: 'Expense',
    amount: 8500,
    department: 'Marketing',
    description: 'Conference attendance and sponsorship - Tech Summit 2025',
    justification: 'Industry-leading conference with expected 5000+ attendees. Opportunity to showcase our products and generate leads.',
    priority: 'Medium',
    status: 'Approved',
    requestedBy: 'Sarah Johnson',
    requestedAt: '2025-12-10 02:15 PM',
    reviewedBy: 'Michael Chen',
    reviewedAt: '2025-12-11 10:00 AM',
    comments: 'Approved. Please coordinate with finance for payment processing.'
  },
  {
    id: '3',
    requestType: 'Purchase',
    amount: 45000,
    description: 'New design software licenses and equipment for creative team',
    department: 'Design',
    justification: 'Current software licenses are expiring. Need to renew and add 5 new licenses for new team members. Also purchasing high-performance workstations.',
    priority: 'High',
    status: 'Under Review',
    requestedBy: 'Emily Davis',
    requestedAt: '2025-12-11 11:20 AM',
  },
  {
    id: '4',
    requestType: 'Payment',
    amount: 25000,
    department: 'Operations',
    description: 'Early payment to vendor for bulk order discount',
    justification: 'Vendor offering 15% discount for early payment. This will save us approximately $4,400 on the total order value.',
    priority: 'Medium',
    status: 'Pending',
    requestedBy: 'Lisa Anderson',
    requestedAt: '2025-12-13 08:45 AM',
  },
  {
    id: '5',
    requestType: 'Contract',
    amount: 120000,
    department: 'Sales',
    description: 'Annual contract renewal with CRM platform provider',
    justification: 'Critical business system used by entire sales team. Contract expires end of month. Negotiated 10% reduction from previous year.',
    priority: 'Critical',
    status: 'Pending',
    requestedBy: 'Michael Brown',
    requestedAt: '2025-12-13 01:30 PM',
  },
  {
    id: '6',
    requestType: 'Expense',
    amount: 3200,
    department: 'HR',
    description: 'Team building event and holiday party',
    justification: 'Annual team building event to boost morale and team cohesion. Includes venue, catering, and activities for 85 employees.',
    priority: 'Low',
    status: 'Rejected',
    requestedBy: 'David Wilson',
    requestedAt: '2025-12-09 03:00 PM',
    reviewedBy: 'Michael Chen',
    reviewedAt: '2025-12-10 09:30 AM',
    comments: 'Budget constraints this quarter. Please resubmit for Q1 2025.'
  }
];

const formFields = [
  { 
    name: 'requestType' as const, 
    label: 'Request Type', 
    type: 'select' as const, 
    options: ['Budget', 'Expense', 'Payment', 'Transfer', 'Purchase', 'Contract'] 
  },
  { name: 'amount' as const, label: 'Amount (USD)', type: 'number' as const, placeholder: '0.00' },
  { name: 'department' as const, label: 'Department', type: 'text' as const, placeholder: 'Select department' },
  { name: 'description' as const, label: 'Description', type: 'textarea' as const, placeholder: 'Brief description of the request' },
  { name: 'justification' as const, label: 'Justification', type: 'textarea' as const, placeholder: 'Detailed justification for this request' },
  { 
    name: 'priority' as const, 
    label: 'Priority', 
    type: 'select' as const, 
    options: ['Low', 'Medium', 'High', 'Critical'] 
  },
];

export default function OrgApprovalManagement() {
  const [approvals, setApprovals] = useState<Approval[]>(mockApprovals);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [commentText, setCommentText] = useState('');

  const handleAdd = (data: z.infer<typeof approvalSchema>) => {
    const newApproval: Approval = {
      id: Date.now().toString(),
      ...data,
      status: 'Pending',
      requestedBy: 'Current User',
      requestedAt: new Date().toLocaleString(),
    };
    setApprovals([newApproval, ...approvals]);
    setIsAddOpen(false);
  };

  const handleApprove = (id: string, comments: string = '') => {
    setApprovals(approvals.map(approval =>
      approval.id === id
        ? {
            ...approval,
            status: 'Approved' as const,
            reviewedBy: 'Current User',
            reviewedAt: new Date().toLocaleString(),
            comments: comments || 'Approved'
          }
        : approval
    ));
    setIsCommentOpen(false);
  };

  const handleReject = (id: string, comments: string = '') => {
    setApprovals(approvals.map(approval =>
      approval.id === id
        ? {
            ...approval,
            status: 'Rejected' as const,
            reviewedBy: 'Current User',
            reviewedAt: new Date().toLocaleString(),
            comments: comments || 'Rejected'
          }
        : approval
    ));
    setIsCommentOpen(false);
  };

  const handleReview = (id: string) => {
    setApprovals(approvals.map(approval =>
      approval.id === id
        ? { ...approval, status: 'Under Review' as const }
        : approval
    ));
  };

  const pendingCount = approvals.filter(a => a.status === 'Pending').length;
  const reviewCount = approvals.filter(a => a.status === 'Under Review').length;
  const pendingAmount = approvals.filter(a => a.status === 'Pending' || a.status === 'Under Review')
    .reduce((sum, a) => sum + a.amount, 0);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-100 text-red-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const columns = createColumns({
    handleApprove,
    handleReject,
    handleReview,
    setSelectedApproval: () => setIsCommentOpen(true),
    getPriorityColor
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Under Review': return 'bg-blue-100 text-blue-800';
      case 'Approved': return 'bg-emerald-100 text-emerald-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending': return <Clock className="w-4 h-4" />;
      case 'Under Review': return <AlertCircle className="w-4 h-4" />;
      case 'Approved': return <CheckCircle className="w-4 h-4" />;
      case 'Rejected': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl text-gray-900">Approval Management</h2>
          <p className="mt-1 text-gray-600">Review and manage approval requests</p>
        </div>
        <Button onClick={() => setIsAddOpen(true)} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="w-4 h-4 mr-2" />
          New Request
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <SectionCard>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Approval</p>
              <p className="mt-1 text-2xl">{pendingCount}</p>
              <p className="mt-1 text-xs text-gray-500">Awaiting review</p>
            </div>
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
        </SectionCard>
        <SectionCard>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600">Under Review</p>
              <p className="mt-1 text-2xl">{reviewCount}</p>
              <p className="mt-1 text-xs text-gray-500">Being processed</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <AlertCircle className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </SectionCard>
        <SectionCard>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Pending Amount</p>
              <p className="mt-1 text-2xl">${pendingAmount.toLocaleString()}</p>
              <p className="mt-1 text-xs text-gray-500">Across all requests</p>
            </div>
            <div className="p-2 rounded-lg bg-emerald-100">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
        </SectionCard>
      </div>

      {/* Approvals Table */}
      <Card>
        <DataTable
          columns={columns}
          data={approvals}
          showPagination={true}
          paginationOptions={{
            pageSizeOptions: [10, 20, 30, 50],
            showRowsPerPage: true,
            showFirstLastButtons: true,
            showPageInfo: true,
            showSelectedRows: false,
          }}
          toolbar={(table) => (
            <div className="flex gap-8">
              <DataTableFilter
                table={table}
                columnKey="requestType"
                placeholder="Filter by type..."
                className="max-w-sm"
              />
              <DataTableFilter
                table={table}
                columnKey="department"
                placeholder="Filter by department..."
                className="max-w-sm"
              />
              <DataTableFilter
                table={table}
                columnKey="priority"
                placeholder="Filter by priority..."
                className="max-w-sm"
              />
            </div>
          )}
        />
      </Card>

      {/* Add Request Dialog */}
      <FormDialog
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleAdd}
        title="Create Approval Request"
        description="Submit a new request for approval"
        schema={approvalSchema}
        fields={formFields}
        submitLabel="Submit Request"
      />

      {/* Comment Dialog */}
      <FormWrapper
        open={isCommentOpen}
        onOpenChange={setIsCommentOpen}
        schema={z.object({ comments: z.string().min(1, 'Comment is required') })}
        defaultValues={{ comments: '' }}
        onSubmit={(data) => {
          console.log('Comment saved:', data.comments);
          setIsCommentOpen(false);
        }}
        title="Add Review Comment"
        description="Enter your comments for this approval request"
        submitLabel="Save Comment"
      >
        {(form) => (
          <FormField
            control={form.control}
            name="comments"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Comments</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter your comments..."
                    rows={4}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </FormWrapper>
    </div>
  );
}
