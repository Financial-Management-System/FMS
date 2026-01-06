"use client";

import { useState } from "react";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { TrendingDown, Plus, DollarSign, Calendar, Filter } from "lucide-react";
import FormDialog from "@/src/components/custom/formDialog";
import { z } from "zod";
import { expenseSchema } from "@/src/schema";
import { DataTable } from "@/src/components/dataTable/dataTable";
import { DataTableFilter } from "@/src/components/dataTable/dataTableFilter";
import { StatCard } from "@/src/components/custom/statCard";
import { StandaloneSelect } from "@/src/components/custom/standaloneSelect";
import { createColumns } from "./columns";


interface Expense {
  id: string;
  title: string;
  category:
    | "Office"
    | "Travel"
    | "Equipment"
    | "Software"
    | "Marketing"
    | "Utilities"
    | "Other";
  amount: number;
  currency: string;
  department: string;
  description: string;
  vendor: string;
  expenseDate: string;
  receiptNumber?: string;
  status: "Approved" | "Pending" | "Rejected";
}

const mockExpenses: Expense[] = [
  {
    id: "1",
    title: "Office Space Rent - December",
    category: "Office",
    amount: 12000,
    currency: "USD",
    department: "Operations",
    description: "Monthly rent for 5000 sq ft office space in downtown",
    vendor: "Downtown Properties LLC",
    expenseDate: "2025-12-01",
    receiptNumber: "RENT-2025-12",
    status: "Approved",
  },
  {
    id: "2",
    title: "Team Laptops - Engineering",
    category: "Equipment",
    amount: 15000,
    currency: "USD",
    department: "Engineering",
    description: "MacBook Pro laptops for 5 new engineering hires",
    vendor: "Apple Business",
    expenseDate: "2025-12-10",
    receiptNumber: "ORD-89456",
    status: "Approved",
  },
  {
    id: "3",
    title: "Conference Travel - Tech Summit",
    category: "Travel",
    amount: 4500,
    currency: "USD",
    department: "Marketing",
    description: "Flights, hotel, and conference tickets for 3 team members",
    vendor: "Corporate Travel Agency",
    expenseDate: "2025-12-08",
    receiptNumber: "TRV-2025-147",
    status: "Approved",
  },
  {
    id: "4",
    title: "Cloud Infrastructure - AWS",
    category: "Software",
    amount: 8700,
    currency: "USD",
    department: "Engineering",
    description: "Monthly AWS hosting and infrastructure costs",
    vendor: "Amazon Web Services",
    expenseDate: "2025-12-05",
    receiptNumber: "AWS-INV-2025-12",
    status: "Approved",
  },
  {
    id: "5",
    title: "Digital Marketing Campaign",
    category: "Marketing",
    amount: 22000,
    currency: "USD",
    department: "Marketing",
    description: "Q4 social media and search engine marketing campaigns",
    vendor: "Digital Marketing Pro",
    expenseDate: "2025-12-11",
    receiptNumber: "DMP-INV-457",
    status: "Pending",
  },
  {
    id: "6",
    title: "Office Utilities - December",
    category: "Utilities",
    amount: 1850,
    currency: "USD",
    department: "Operations",
    description: "Electricity, water, and internet services",
    vendor: "City Utilities & Services",
    expenseDate: "2025-12-13",
    status: "Approved",
  },
];

const formFields = [
  {
    name: "title" as const,
    label: "Expense Title",
    type: "text" as const,
    placeholder: "e.g., Office Supplies",
  },
  {
    name: "category" as const,
    label: "Category",
    type: "select" as const,
    options: [
      "Office",
      "Travel",
      "Equipment",
      "Software",
      "Marketing",
      "Utilities",
      "Other",
    ],
  },
  {
    name: "amount" as const,
    label: "Amount",
    type: "number" as const,
    placeholder: "0.00",
  },
  {
    name: "currency" as const,
    label: "Currency",
    type: "text" as const,
    placeholder: "USD",
  },
  {
    name: "department" as const,
    label: "Department",
    type: "text" as const,
    placeholder: "Select department",
  },
  {
    name: "description" as const,
    label: "Description",
    type: "textarea" as const,
    placeholder: "Detailed description",
  },
  {
    name: "vendor" as const,
    label: "Vendor",
    type: "text" as const,
    placeholder: "Vendor or supplier name",
  },
  {
    name: "expenseDate" as const,
    label: "Expense Date",
    type: "text" as const,
    placeholder: "YYYY-MM-DD",
  },
  {
    name: "receiptNumber" as const,
    label: "Receipt Number (Optional)",
    type: "text" as const,
    placeholder: "RCP-XXX",
  },
];

export default function OrgExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [table, setTable] = useState<any>(null);

  const getFilteredData = () => {
    if (!table) return expenses;
    return table.getFilteredRowModel().rows.map((row: any) => row.original);
  };

  const filteredExpenses = getFilteredData();

  const handleAdd = (data: z.infer<typeof expenseSchema>) => {
    const newExpense: Expense = {
      id: Date.now().toString(),
      ...data,
      status: "Pending",
    };
    setExpenses([newExpense, ...expenses]);
    setIsAddOpen(false);
  };

  const handleEdit = (data: z.infer<typeof expenseSchema>) => {
    if (!editingExpense) return;
    setExpenses(
      expenses.map((expense) =>
        expense.id === editingExpense.id ? { ...expense, ...data } : expense
      )
    );
    setEditingExpense(null);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this expense?")) {
      setExpenses(expenses.filter((expense) => expense.id !== id));
    }
  };

  const totalExpenses = filteredExpenses.reduce(
    (sum: number, expense: Expense) => sum + expense.amount,
    0
  );
  const approvedExpenses = filteredExpenses
    .filter((e: Expense) => e.status === "Approved")
    .reduce((sum: number, e: Expense) => sum + e.amount, 0);
  const pendingExpenses = filteredExpenses
    .filter((e: Expense) => e.status === "Pending")
    .reduce((sum: number, e: Expense) => sum + e.amount, 0);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Office":
        return "bg-blue-100 text-blue-800";
      case "Travel":
        return "bg-purple-100 text-purple-800";
      case "Equipment":
        return "bg-orange-100 text-orange-800";
      case "Software":
        return "bg-cyan-100 text-cyan-800";
      case "Marketing":
        return "bg-pink-100 text-pink-800";
      case "Utilities":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-emerald-100 text-emerald-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const columns = createColumns({
    setEditingExpense,
    handleDelete,
    getCategoryColor,
  });

  const toolbar = (tableInstance: any) => (
    <div className="flex flex-col lg:flex-row gap-4">
      <DataTableFilter
        table={tableInstance}
        columnKey="title"
        placeholder="Search expenses..."
        className="max-w-sm"
      />
      <StandaloneSelect
        value={(tableInstance.getColumn('category')?.getFilterValue() as string) ?? 'All'}
        onValueChange={(value) => 
          tableInstance.getColumn('category')?.setFilterValue(value === 'All' ? '' : value)
        }
        placeholder="All Categories"
        options={[
          { value: 'All', label: 'All Categories' },
          { value: 'Office', label: 'Office' },
          { value: 'Travel', label: 'Travel' },
          { value: 'Equipment', label: 'Equipment' },
          { value: 'Software', label: 'Software' },
          { value: 'Marketing', label: 'Marketing' },
          { value: 'Utilities', label: 'Utilities' },
          { value: 'Other', label: 'Other' },
        ]}
      />
      <StandaloneSelect
        value={(tableInstance.getColumn('status')?.getFilterValue() as string) ?? 'All'}
        onValueChange={(value) => 
          tableInstance.getColumn('status')?.setFilterValue(value === 'All' ? '' : value)
        }
        placeholder="All Statuses"
        options={[
          { value: 'All', label: 'All Statuses' },
          { value: 'Approved', label: 'Approved' },
          { value: 'Pending', label: 'Pending' },
          { value: 'Rejected', label: 'Rejected' },
        ]}
      />
      <Button variant="outline">
        <Filter className="w-4 h-4 mr-2" />
        More Filters
      </Button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        
        <div>
          <h2 className="text-2xl text-gray-900">Expenses</h2>
          <p className="text-gray-600 mt-1">
            Track and categorize business expenses
          </p>
        </div>
        <Button
          onClick={() => setIsAddOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Expense
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total Expenses"
          value={`$${totalExpenses.toLocaleString()}`}
          subtitle={`${filteredExpenses.length} expenses`}
          icon={TrendingDown}
          variant="red"
          size="medium"
        />

        <StatCard
          title="Approved"
          value={`$${approvedExpenses.toLocaleString()}`}
          subtitle={`${
            filteredExpenses.filter((e: Expense) => e.status === "Approved").length
          } expenses`}
          icon={DollarSign}
          variant="emerald"
          size="medium"
        />

        <StatCard
          title="Pending Approval"
          value={`$${pendingExpenses.toLocaleString()}`}
          subtitle={`${
            filteredExpenses.filter((e: Expense) => e.status === "Pending").length
          } awaiting`}
          icon={Calendar}
          variant="yellow"
          size="medium"
        />
      </div>


      {/* Expenses Table */}
      <Card>
        <DataTable
          columns={columns}
          data={expenses}
          toolbar={toolbar}
          getTableInstance={setTable}
          showPagination={true}
          paginationOptions={{
            pageSizeOptions: [10, 20, 30, 50],
            showRowsPerPage: true,
            showFirstLastButtons: true,
            showPageInfo: true,
            showSelectedRows: false,
          }}
        />
      </Card>      {/* Add Expense Dialog */}
      <FormDialog
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleAdd}
        title="Add Expense"
        description="Record a new business expense"
        schema={expenseSchema}
        fields={formFields}
        submitLabel="Add Expense"
      />

      {/* Edit Expense Dialog */}
      {editingExpense && (
        <FormDialog
          open={!!editingExpense}
          onClose={() => setEditingExpense(null)}
          onSubmit={handleEdit}
          title="Edit Expense"
          description="Update expense details"
          schema={expenseSchema}
          fields={formFields}
          defaultValues={{
            title: editingExpense.title,
            category: editingExpense.category,
            amount: editingExpense.amount,
            currency: editingExpense.currency,
            department: editingExpense.department,
            description: editingExpense.description,
            vendor: editingExpense.vendor,
            expenseDate: editingExpense.expenseDate,
            receiptNumber: editingExpense.receiptNumber || "",
          }}
          submitLabel="Update Expense"
        />
      )}
    </div>
  );
}
