"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Shield, Edit, Trash2, MoreHorizontal } from "lucide-react";
import { cn } from "@/src/components/ui/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";

export interface Role {
  _id: string;
  name: string;
  description: string;
  permissions: string[];
  orgId: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
  updatedAt: string;
}

interface RoleColumnsProps {
  onEdit: (role: Role) => void;
  onDelete: (id: string) => void;
  onManagePermissions: (role: Role) => void;
}



export const createRoleColumns = ({ onEdit, onDelete, onManagePermissions }: RoleColumnsProps): ColumnDef<Role>[] => [
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
    accessorKey: 'permissions',
    header: 'Permissions',
    cell: ({ row }) => (
      <div className="text-sm text-gray-600">
        {row.original.permissions.length} permission(s)
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge variant={row.original.status === 'Active' ? 'default' : 'secondary'}>
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }) => (
      <div className="text-sm text-gray-600">
        {new Date(row.original.createdAt).toLocaleDateString()}
      </div>
    ),
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onManagePermissions(row.original)}>
            <Shield className="mr-2 h-4 w-4" />
            Manage Permissions
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onEdit(row.original)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Role
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => onDelete(row.original._id)}
            className="text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Role
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];