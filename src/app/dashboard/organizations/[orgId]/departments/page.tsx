'use client';

import { useState } from "react";
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
  MoreVertical,
} from "lucide-react";
import  FormDialog  from "@/src/components/custom/formDialog";
import { z } from "zod";
import { departmentSchema } from "@/src/schema";

interface Department {
  id: string;
  name: string;
  description: string;
  manager: string;
  memberCount: number;
  budget: number;
  spent: number;
  projects: number;
}

const mockDepartments: Department[] = [
  {
    id: "1",
    name: "Engineering",
    description:
      "Software development and technical infrastructure",
    manager: "John Smith",
    memberCount: 45,
    budget: 500000,
    spent: 320000,
    projects: 12,
  },
  {
    id: "2",
    name: "Marketing",
    description: "Brand management and customer acquisition",
    manager: "Sarah Johnson",
    memberCount: 28,
    budget: 350000,
    spent: 315000,
    projects: 8,
  },
  {
    id: "3",
    name: "Sales",
    description: "Revenue generation and customer relations",
    manager: "Michael Brown",
    memberCount: 35,
    budget: 280000,
    spent: 180000,
    projects: 5,
  },
  {
    id: "4",
    name: "Finance",
    description: "Financial planning and analysis",
    manager: "Emily Davis",
    memberCount: 15,
    budget: 180000,
    spent: 95000,
    projects: 4,
  },
  {
    id: "5",
    name: "Human Resources",
    description: "Talent management and employee relations",
    manager: "David Wilson",
    memberCount: 12,
    budget: 150000,
    spent: 88000,
    projects: 3,
  },
  {
    id: "6",
    name: "Operations",
    description: "Business operations and process optimization",
    manager: "Lisa Anderson",
    memberCount: 20,
    budget: 220000,
    spent: 140000,
    projects: 7,
  },
];

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

export default function OrgDepartments() {
  const [departments, setDepartments] =
    useState<Department[]>(mockDepartments);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingDept, setEditingDept] =
    useState<Department | null>(null);

  const handleAdd = (
    data: z.infer<typeof departmentSchema>,
  ) => {
    const newDept: Department = {
      id: Date.now().toString(),
      name: data.name,
      description: data.description,
      manager: data.manager,
      budget: data.budget,
      memberCount: 0,
      spent: 0,
      projects: 0,
    };
    setDepartments([...departments, newDept]);
    setIsAddOpen(false);
  };

  const handleEdit = (
    data: z.infer<typeof departmentSchema>,
  ) => {
    if (!editingDept) return;
    setDepartments(
      departments.map((dept) =>
        dept.id === editingDept.id
          ? { ...dept, ...data }
          : dept,
      ),
    );
    setEditingDept(null);
  };

  const handleDelete = (id: string) => {
    if (
      confirm(
        "Are you sure you want to delete this department?",
      )
    ) {
      setDepartments(
        departments.filter((dept) => dept.id !== id),
      );
    }
  };

  const getBudgetPercentage = (
    spent: number,
    budget: number,
  ) => {
    return (spent / budget) * 100;
  };

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
        {departments.map((dept) => {
          const budgetPercent = getBudgetPercentage(
            dept.spent,
            dept.budget,
          );
          const isOverBudget = budgetPercent > 100;
          const isNearLimit =
            budgetPercent > 80 && budgetPercent <= 100;

          return (
            <Card key={dept.id} className="p-6">
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
                    onClick={() => handleDelete(dept.id)}
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
        })}
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