import { z } from 'zod';

// User Schema
export const UserSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters.' })
    .max(50, { message: 'Name cannot exceed 50 characters.' }),
  email: z
    .string()
    .email({ message: 'Please enter a valid email address.' }),
  role: z.enum(['Standard', 'Premium', 'Enterprise'], {
    message: 'Please select a valid role.',
  }),
  balance: z.coerce
    .number()
    .min(0, { message: 'Balance must be a positive number.' }),
});

export type UserFormData = z.infer<typeof UserSchema>;

// Organization Schema
export const OrganizationSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Organization name must be at least 2 characters.' })
    .max(100, { message: 'Organization name cannot exceed 100 characters.' }),
  description: z
    .string()
    .min(10, { message: 'Description must be at least 10 characters.' })
    .max(500, { message: 'Description cannot exceed 500 characters.' }),
  type: z.enum(['Corporation', 'LLC', 'Partnership', 'Sole Proprietorship', 'Non-Profit'], {
    message: 'Please select a valid organization type.',
  }),
  industry: z
    .string()
    .min(1, { message: 'Industry is required.' }),
  email: z
    .string()
    .email({ message: 'Please enter a valid email address.' }),
  phone: z
    .string()
    .min(10, { message: 'Phone number must be at least 10 digits.' })
    .regex(/^[0-9+\-\s()]+$/, { message: 'Please enter a valid phone number.' }),
  website: z
    .string()
    .url({ message: 'Please enter a valid URL.' })
    .optional()
    .or(z.literal('')),
  country: z
    .string()
    .min(1, { message: 'Country is required.' }),
  revenue: z.coerce
    .number()
    .min(0, { message: 'Revenue must be a positive number.' })
    .optional(),
  employees: z.coerce
    .number()
    .min(1, { message: 'Number of employees must be at least 1.' })
    .optional(),
});

export type OrganizationFormData = z.infer<typeof OrganizationSchema>;

// Transaction Filter Schema
export const TransactionFilterSchema = z.object({
  searchTerm: z.string().optional(),
  status: z.string().optional(),
  type: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
});

export type TransactionFilterData = z.infer<typeof TransactionFilterSchema>;

// Settings Schema
export const SecuritySettingsSchema = z.object({
  currentPassword: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters.' }),
  newPassword: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters.' })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
      message: 'Password must contain uppercase, lowercase, and number.',
    }),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export type SecuritySettingsFormData = z.infer<typeof SecuritySettingsSchema>;

export const NotificationSettingsSchema = z.object({
  emailNotifications: z.boolean().default(true),
  pushNotifications: z.boolean().default(false),
  transactionAlerts: z.boolean().default(true),
  weeklyReports: z.boolean().default(false),
  marketingEmails: z.boolean().default(false),
});

export type NotificationSettingsFormData = z.infer<typeof NotificationSettingsSchema>;

export const ProfileSettingsSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters.' }),
  email: z
    .string()
    .email({ message: 'Please enter a valid email address.' }),
  phone: z
    .string()
    .regex(/^[0-9+\-\s()]+$/, { message: 'Please enter a valid phone number.' })
    .optional()
    .or(z.literal('')),
  timezone: z.string().min(1, { message: 'Timezone is required.' }),
  language: z.string().min(1, { message: 'Language is required.' }),
});

export type ProfileSettingsFormData = z.infer<typeof ProfileSettingsSchema>;

// Settings Schema (for Settings page)
export const SettingsSchema = z.object({
  systemName: z.string().min(3, { message: 'System name must be at least 3 characters.' }),
  timezone: z.string(),
  currency: z.string(),
  twoFactor: z.boolean(),
  sessionTimeout: z.string(),
  ipWhitelist: z.boolean(),
  highValueNotifications: z.boolean(),
  failedTransactionsNotifications: z.boolean(),
  systemUpdatesNotifications: z.boolean(),
  webhookUrl: z.string().url({ message: 'Please enter a valid URL.' }).optional().or(z.literal('')),
});

export type SettingsFormData = z.infer<typeof SettingsSchema>;

// OkaneSpecials (Organizations) Schema - Updated to match backend
export const OkaneSpecialsSchema = z.object({
  name: z.string().min(2, { message: 'Company name must be at least 2 characters.' }),
  category: z.string().min(2, { message: 'Category is required.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phone: z.string().min(7, { message: 'Phone number must be at least 7 digits.' }),
  location: z.string().min(2, { message: 'Location is required.' }),
  country: z.string().min(2, { message: 'Country is required.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }).optional(),
  employees: z.coerce.number().min(1, { message: 'Number of employees must be at least 1.' }).optional(),
  revenue: z.string().min(1, { message: 'Revenue is required.' }).optional(),
  image: z.string().url({ message: 'Please enter a valid URL.' }).optional().or(z.literal('')),
  status: z.enum(['Active', 'Pending', 'Inactive']).optional(),
});

export type OkaneSpecialsFormData = z.infer<typeof OkaneSpecialsSchema>;

// Department Schema
export const departmentSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Department name must be at least 2 characters.' })
    .max(100, { message: 'Department name cannot exceed 100 characters.' }),
  description: z
    .string()
    .min(10, { message: 'Description must be at least 10 characters.' })
    .max(500, { message: 'Description cannot exceed 500 characters.' }),
  manager: z
    .string()
    .min(2, { message: 'Manager name must be at least 2 characters.' }),
  budget: z.coerce
    .number()
    .min(0, { message: 'Budget must be a positive number.' }),
});

export type DepartmentFormData = z.infer<typeof departmentSchema>;

// User Management Schema
export const userManagementSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters.' })
    .max(50, { message: 'Name cannot exceed 50 characters.' }),
  email: z
    .string()
    .email({ message: 'Please enter a valid email address.' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters.' }),
  role: z.enum(['Standard', 'Premium', 'Enterprise']).optional(),
  department: z.string().optional(),
  phone: z
    .string()
    .regex(/^[0-9+\-\s()]+$/, { message: 'Please enter a valid phone number.' })
    .optional()
    .or(z.literal('')),
  status: z.enum(['Active', 'Inactive', 'Suspended']),
});

export type UserManagementFormData = z.infer<typeof userManagementSchema>;

// Role Schema
export const roleSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Role name must be at least 2 characters.' })
    .max(50, { message: 'Role name cannot exceed 50 characters.' }),
  description: z
    .string()
    .min(10, { message: 'Description must be at least 10 characters.' })
    .max(300, { message: 'Description cannot exceed 300 characters.' }),
  level: z.enum(['Admin', 'Manager', 'User', 'Viewer']),
});

export type RoleFormData = z.infer<typeof roleSchema>;

// Financial Operations Schema
export const financialOperationSchema = z.object({
  title: z
    .string()
    .min(3, { message: 'Title must be at least 3 characters.' })
    .max(100, { message: 'Title cannot exceed 100 characters.' }),
  type: z.enum(['Payment', 'Transfer', 'Invoice', 'Expense', 'Refund', 'Payroll']),
  amount: z.coerce
    .number()
    .min(0.01, { message: 'Amount must be greater than 0.' }),
  currency: z.string().min(1, { message: 'Currency is required.' }),
  category: z.string().min(1, { message: 'Category is required.' }),
  department: z.string().min(1, { message: 'Department is required.' }),
  description: z
    .string()
    .min(10, { message: 'Description must be at least 10 characters.' })
    .max(500, { message: 'Description cannot exceed 500 characters.' }),
  recipient: z.string().min(2, { message: 'Recipient is required.' }),
  dueDate: z.string().min(1, { message: 'Due date is required.' }),
});

export type FinancialOperationFormData = z.infer<typeof financialOperationSchema>;

// Approval Management Schema
export const approvalSchema = z.object({
  requestType: z.enum(['Budget', 'Expense', 'Payment', 'Transfer', 'Purchase', 'Contract']),
  amount: z.coerce
    .number()
    .min(0.01, { message: 'Amount must be greater than 0.' }),
  department: z.string().min(1, { message: 'Department is required.' }),
  description: z
    .string()
    .min(10, { message: 'Description must be at least 10 characters.' })
    .max(500, { message: 'Description cannot exceed 500 characters.' }),
  justification: z
    .string()
    .min(20, { message: 'Justification must be at least 20 characters.' })
    .max(1000, { message: 'Justification cannot exceed 1000 characters.' }),
  priority: z.enum(['Low', 'Medium', 'High', 'Critical']),
});

export type ApprovalFormData = z.infer<typeof approvalSchema>;

// Income Schema
export const incomeSchema = z.object({
  source: z
    .string()
    .min(2, { message: 'Source must be at least 2 characters.' })
    .max(100, { message: 'Source cannot exceed 100 characters.' }),
  category: z.enum(['Sales', 'Services', 'Investment', 'Grant', 'Donation', 'Other']),
  amount: z.coerce
    .number()
    .min(0.01, { message: 'Amount must be greater than 0.' }),
  currency: z.string().min(1, { message: 'Currency is required.' }),
  description: z
    .string()
    .min(10, { message: 'Description must be at least 10 characters.' })
    .max(500, { message: 'Description cannot exceed 500 characters.' }),
  receivedDate: z.string().min(1, { message: 'Received date is required.' }),
  invoiceNumber: z.string().optional(),
  client: z.string().min(1, { message: 'Client/Payer is required.' }),
});

export type IncomeFormData = z.infer<typeof incomeSchema>;

// Expense Schema
export const expenseSchema = z.object({
  title: z
    .string()
    .min(3, { message: 'Title must be at least 3 characters.' })
    .max(100, { message: 'Title cannot exceed 100 characters.' }),
  category: z.enum(['Office', 'Travel', 'Equipment', 'Software', 'Marketing', 'Utilities', 'Other']),
  amount: z.coerce
    .number()
    .min(0.01, { message: 'Amount must be greater than 0.' }),
  currency: z.string().min(1, { message: 'Currency is required.' }),
  department: z.string().min(1, { message: 'Department is required.' }),
  description: z
    .string()
    .min(10, { message: 'Description must be at least 10 characters.' })
    .max(500, { message: 'Description cannot exceed 500 characters.' }),
  vendor: z.string().min(2, { message: 'Vendor is required.' }),
  expenseDate: z.string().min(1, { message: 'Expense date is required.' }),
  receiptNumber: z.string().optional(),
});

export type ExpenseFormData = z.infer<typeof expenseSchema>;

// Payroll Schema
export const payrollSchema = z.object({
  employeeName: z
    .string()
    .min(2, { message: 'Employee name must be at least 2 characters.' })
    .max(100, { message: 'Employee name cannot exceed 100 characters.' }),
  employeeId: z.string().min(1, { message: 'Employee ID is required.' }),
  position: z.string().min(2, { message: 'Position is required.' }),
  department: z.string().min(1, { message: 'Department is required.' }),
  baseSalary: z.coerce
    .number()
    .min(0, { message: 'Base salary must be 0 or greater.' }),
  bonus: z.coerce.number().min(0).optional(),
  deductions: z.coerce.number().min(0).optional(),
  payPeriod: z.string().min(1, { message: 'Pay period is required.' }),
  paymentDate: z.string().min(1, { message: 'Payment date is required.' }),
});

export type PayrollFormData = z.infer<typeof payrollSchema>;

// Recurring Expense Schema
export const recurringExpenseSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Name must be at least 3 characters.' })
    .max(100, { message: 'Name cannot exceed 100 characters.' }),
  category: z.enum(['Subscription', 'Utilities', 'Rent', 'Insurance', 'Licenses', 'Other']),
  amount: z.coerce
    .number()
    .min(0.01, { message: 'Amount must be greater than 0.' }),
  currency: z.string().min(1, { message: 'Currency is required.' }),
  frequency: z.enum(['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Annually']),
  vendor: z.string().min(2, { message: 'Vendor is required.' }),
  description: z
    .string()
    .min(10, { message: 'Description must be at least 10 characters.' })
    .max(500, { message: 'Description cannot exceed 500 characters.' }),
  startDate: z.string().min(1, { message: 'Start date is required.' }),
  nextPayment: z.string().min(1, { message: 'Next payment date is required.' }),
});

export type RecurringExpenseFormData = z.infer<typeof recurringExpenseSchema>;

// Approval Rule Schema
export const approvalRuleSchema = z.object({
  ruleName: z
    .string()
    .min(3, { message: 'Rule name must be at least 3 characters.' })
    .max(100, { message: 'Rule name cannot exceed 100 characters.' }),
  requestType: z.enum(['Budget', 'Expense', 'Payment', 'Transfer', 'Purchase', 'Contract', 'All']),
  minAmount: z.coerce.number().min(0, { message: 'Minimum amount must be 0 or greater.' }),
  maxAmount: z.coerce.number().min(0, { message: 'Maximum amount must be 0 or greater.' }),
  approverRole: z.string().min(1, { message: 'Approver role is required.' }),
  department: z.string().min(1, { message: 'Department is required.' }),
  autoApprove: z.boolean().optional(),
});

export type ApprovalRuleFormData = z.infer<typeof approvalRuleSchema>;

// Budget Schema
export const budgetSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Budget name must be at least 3 characters.' })
    .max(100, { message: 'Budget name cannot exceed 100 characters.' }),
  department: z.string().min(1, { message: 'Department is required.' }),
  category: z.string().min(1, { message: 'Category is required.' }),
  totalAmount: z.coerce.number().min(0.01, { message: 'Total amount must be greater than 0.' }),
  period: z.enum(['Monthly', 'Quarterly', 'Annually']),
  startDate: z.string().min(1, { message: 'Start date is required.' }),
  endDate: z.string().min(1, { message: 'End date is required.' }),
  description: z
    .string()
    .min(10, { message: 'Description must be at least 10 characters.' })
    .max(500, { message: 'Description cannot exceed 500 characters.' }),
});

export type BudgetFormData = z.infer<typeof budgetSchema>;

// Currency Schema
export const currencySchema = z.object({
  code: z
    .string()
    .min(3, { message: 'Currency code must be 3 characters.' })
    .max(3, { message: 'Currency code must be 3 characters.' }),
  name: z
    .string()
    .min(2, { message: 'Currency name must be at least 2 characters.' })
    .max(50, { message: 'Currency name cannot exceed 50 characters.' }),
  symbol: z.string().min(1, { message: 'Currency symbol is required.' }),
  exchangeRate: z.coerce.number().min(0.01, { message: 'Exchange rate must be greater than 0.' }),
});

export type CurrencyFormData = z.infer<typeof currencySchema>;

// Profile Schema
export const profileSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: 'Full name must be at least 2 characters.' })
    .max(100, { message: 'Full name cannot exceed 100 characters.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  phone: z.string().min(10, { message: 'Phone number must be at least 10 characters.' }),
  position: z.string().min(2, { message: 'Position is required.' }),
  department: z.string().min(1, { message: 'Department is required.' }),
  bio: z
    .string()
    .max(500, { message: 'Bio cannot exceed 500 characters.' })
    .optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;