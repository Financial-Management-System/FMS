"use client";

import { Button } from '@/src/components/ui/button';
import { Edit, Trash2, Phone, UserCheck, UserX, UserMinus } from 'lucide-react';
import { cn } from '@/src/components/ui/utils';
import { ColumnDef } from '@tanstack/react-table';

interface User {
    id: string;
    name: string;
    username?: string;
    email: string;
    role: 'Standard' | 'Premium' | 'Enterprise';
    department: string;
    phone: string;
    status: 'Active' | 'Inactive' | 'Suspended';
    joinedDate: string;
    lastActive?: string;
}

interface ColumnActions {
    onEdit: (user: User) => void;
    onDelete: (id: string) => void;
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'Active':
            return 'bg-emerald-100 text-emerald-700 border-emerald-200';
        case 'Inactive':
            return 'bg-gray-100 text-gray-700 border-gray-200';
        case 'Suspended':
            return 'bg-red-100 text-red-700 border-red-200';
        default:
            return 'bg-gray-100 text-gray-700 border-gray-200';
    }
};

const getStatusIcon = (status: string) => {
    switch (status) {
        case 'Active':
            return <UserCheck className="w-4 h-4" />;
        case 'Inactive':
            return <UserX className="w-4 h-4" />;
        case 'Suspended':
            return <UserMinus className="w-4 h-4" />;
        default:
            return null;
    }
};

export const createUserColumns = (actions: ColumnActions): ColumnDef<User>[] => [
    {
        accessorKey: 'name',
        header: 'User',
        cell: ({ row }) => {
            const user = row.original;
            return (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-white flex-shrink-0">
                        {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                        <p className="text-sm text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: 'role',
        header: 'Role & Department',
        cell: ({ row }) => {
            const user = row.original;
            return (
                <div>
                    <p className="text-sm text-gray-900">{user.role}</p>
                    <p className="text-xs text-gray-500">{user.department}</p>
                </div>
            );
        },
    },
    {
        accessorKey: 'phone',
        header: 'Contact',
        cell: ({ row }) => {
            const user = row.original;
            return (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{user.phone}</span>
                </div>
            );
        },
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const user = row.original;
            return (
                <div className={cn('inline-flex items-center gap-1 px-2 py-1 rounded-md border text-xs', getStatusColor(user.status))}>
                    {getStatusIcon(user.status)}
                    {user.status}
                </div>
            );
        },
    },
    {
        accessorKey: 'joinedDate',
        header: 'Joined Date',
        cell: ({ row }) => {
            const user = row.original;
            return (
                <span className="text-sm text-gray-600">
                    {new Date(user.joinedDate).toLocaleDateString()}
                </span>
            );
        },
    },
    {
        accessorKey: 'lastActive',
        header: 'Last Active',
        cell: ({ row }) => {
            const user = row.original;
            return (
                <span className="text-sm text-gray-600">
                    {user.lastActive ? new Date(user.lastActive).toLocaleDateString() : 'N/A'}
                </span>
            );
        },
    },
    {
        id: 'actions',
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => {
            const user = row.original;
            return (
                <div className="flex justify-end gap-2">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => actions.onEdit(user)}
                    >
                        <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => actions.onDelete(user.id)}
                        className="text-red-600 hover:bg-red-50"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            );
        },
    },
];

export type { User, ColumnActions };
