'use client';

import { useState, useEffect } from "react";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import {
  FolderKanban,
  Plus,
  Edit,
  Trash2,
  Users,
  DollarSign,
  Target,
  TrendingUp,
  Loader2,
} from "lucide-react";
import  FormDialog  from "@/src/components/custom/formDialog";
import { z } from "zod";
import { departmentSchema } from "@/src/schema";
import { toast } from "react-toastify";

interface Department {
  _id?: string;
  id?: string;
  org_id: string;
  name: string;
  description: string;
  manager: string;
  memberCount: number;
  budget: number;
  spent: number;
  projects: number;
  status?: string;
}

const formFields = [
  {
    name: "name" as const,
    label: "Department Name",
    type: "text" as const,
    placeholder: "e.g., Engineering",
  },
  {
    name: "description" as const,
    label: "Description",
    type: "textarea" as const,
    placeholder: "Brief description of the department",
  },
  {
    name: "manager" as const,
    label: "Manager",
    type: "text" as const,
    placeholder: "Department manager name",
  },
  {
    name: "budget" as const,
    label: "Annual Budget",
    type: "number" as const,
    placeholder: "0.00",
  },
];

export default function OrgDepartments({ params }: { params: Promise<{ orgId: string }> }) {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [orgId, setOrgId] = useState<string>('');

  // Fetch departments from API
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const resolvedParams = await params;
        setOrgId(resolvedParams.orgId);
        
        const response = await fetch(`/api/department?org_id=${resolvedParams.orgId}&limit=100`);
        const result = await response.json();

        if (result.success) {
          setDepartments(result.data);
        } else {
          toast.error(result.message || 'Failed to fetch departments');
        }
      } catch (error) {
        console.error('Error fetching departments:', error);
        toast.error('Failed to load departments');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDepartments();
  }, [params]);

  const handleAdd = async (data: z.infer<typeof departmentSchema>) => {
    try {
      const response = await fetch('/api/department', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          org_id: orgId,
          memberCount: 0,
          spent: 0,
          projects: 0,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setDepartments([result.data, ...departments]);
        setIsAddOpen(false);
        toast.success('Department created successfully');
      } else {
        toast.error(result.message || 'Failed to create department');
      }
    } catch (error) {
      console.error('Error creating department:', error);
      toast.error('Failed to create department');
    }
  };

  const handleEdit = async (data: z.infer<typeof departmentSchema>) => {
    if (!editingDept) return;
    
    try {
      const id = editingDept._id || editingDept.id;
      const response = await fetch(`/api/department/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        setDepartments(
          departments.map((dept) =>
            (dept._id || dept.id) === id ? result.data : dept
          )
        );
        setEditingDept(null);
        toast.success('Department updated successfully');
      } else {
        toast.error(result.message || 'Failed to update department');
      }
    } catch (error) {
      console.error('Error updating department:', error);
      toast.error('Failed to update department');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this department?")) {
      return;
    }

    try {
      const response = await fetch(`/api/department/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        setDepartments(departments.filter((dept) => (dept._id || dept.id) !== id));
        toast.success('Department deleted successfully');
      } else {
        toast.error(result.message || 'Failed to delete department');
      }
    } catch (error) {
      console.error('Error deleting department:', error);
      toast.error('Failed to delete department');
    }
  };

  const getBudgetPercentage = (
    spent: number,
    budget: number,
  ) => {
    return budget > 0 ? (spent / budget) * 100 : 0;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl">Departments & Projects</h2>
          <p className="text-gray-600">
            Manage organizational structure and projects
          </p>
        </div>
        <Button onClick={() => setIsAddOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Department
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">
                Total Departments
              </div>
              <div className="mt-1 text-2xl">
                {departments.length}
              </div>
            </div>
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-emerald-100">
              <FolderKanban className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">
                Total Members
              </div>
              <div className="mt-1 text-2xl">
                {departments.reduce(
                  (sum, d) => sum + d.memberCount,
                  0,
                )}
              </div>
            </div>
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">
                Total Budget
              </div>
              <div className="mt-1 text-2xl">
                $
                {(
                  departments.reduce(
                    (sum, d) => sum + d.budget,
                    0,
                  ) / 1000
                ).toFixed(0)}
                k
              </div>
            </div>
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">
                Active Projects
              </div>
              <div className="mt-1 text-2xl">
                {departments.reduce(
                  (sum, d) => sum + d.projects,
                  0,
                )}
              </div>
            </div>
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-amber-100">
              <Target className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Departments Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {departments.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
            <FolderKanban className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Departments Yet</h3>
            <p className="text-gray-600 mb-4">Get started by creating your first department</p>
            <Button onClick={() => setIsAddOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Department
            </Button>
          </div>
        ) : (
          departments.map((dept) => {
            const budgetPercent = getBudgetPercentage(
              dept.spent,
              dept.budget,
            );
            const isOverBudget = budgetPercent > 100;
            const isNearLimit =
              budgetPercent > 80 && budgetPercent <= 100;

            return (
              <Card key={dept._id || dept.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-100">
                      <FolderKanban className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-base">{dept.name}</h3>
                      <p className="text-sm text-gray-600">
                        {dept.manager}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingDept(dept)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(dept._id || dept.id!)}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </div>

                <p className="mb-4 text-sm text-gray-600">
                  {dept.description}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="p-2 text-center rounded bg-gray-50">
                    <div className="text-xs text-gray-600">
                      Members
                    </div>
                    <div className="font-medium">
                      {dept.memberCount}
                    </div>
                  </div>
                  <div className="p-2 text-center rounded bg-gray-50">
                    <div className="text-xs text-gray-600">
                      Projects
                    </div>
                    <div className="font-medium">
                      {dept.projects}
                    </div>
                  </div>
                  <div className="p-2 text-center rounded bg-gray-50">
                    <div className="text-xs text-gray-600">
                      Budget %
                    </div>
                    <div
                      className={`font-medium ${isOverBudget ? "text-red-600" : isNearLimit ? "text-amber-600" : "text-emerald-600"}`}
                    >
                      {budgetPercent.toFixed(0)}%
                    </div>
                  </div>
                </div>

                {/* Budget Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Budget</span>
                    <span className="font-medium">
                      ${(dept.spent / 1000).toFixed(0)}k / $
                      {(dept.budget / 1000).toFixed(0)}k
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden bg-gray-200 rounded-full">
                    <div
                      className={`h-full transition-all ${
                        isOverBudget
                          ? "bg-red-600"
                          : isNearLimit
                            ? "bg-amber-600"
                            : "bg-emerald-600"
                      }`}
                      style={{
                        width: `${Math.min(budgetPercent, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Add Department Dialog */}
      <FormDialog
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleAdd}
        title="Add New Department"
        description="Create a new department in your organization"
        schema={departmentSchema}
        fields={formFields}
        submitLabel="Create Department"
      />

      {/* Edit Department Dialog */}
      {editingDept && (
        <FormDialog
          open={!!editingDept}
          onClose={() => setEditingDept(null)}
          onSubmit={handleEdit}
          title="Edit Department"
          description="Update department information"
          schema={departmentSchema}
          fields={formFields}
          defaultValues={{
            name: editingDept.name,
            description: editingDept.description,
            manager: editingDept.manager,
            budget: editingDept.budget,
          }}
          submitLabel="Save Changes"
        />
      )}
    </div>
  );
}