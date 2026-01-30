// User Types
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'Standard' | 'Premium' | 'Enterprise';
  status: 'Active' | 'Suspended' | 'Inactive';
  balance: number;
  joinDate: string;
  transactions: number;
}

// Transaction Types
export interface Transaction {
  id: string;
  user: string;
  email: string;
  amount: number;
  type: 'income' | 'expense' | 'Deposit' | 'Withdrawal' | 'Transfer' | 'Payment';
  status: 'Completed' | 'Pending' | 'Failed' | 'Received' | 'Overdue' | 'Approved' | 'Rejected';
  date: string;
  method?: string;
  company?: string;
}

// Organization Types
export interface Organization {
  id: string;
  name: string;
  description: string;
  type: 'Corporation' | 'LLC' | 'Partnership' | 'Sole Proprietorship' | 'Non-Profit';
  industry: string;
  email: string;
  phone: string;
  website?: string;
  country: string;
  revenue?: number;
  employees?: number;
  createdAt: string;
  status: 'Active' | 'Inactive' | 'Suspended';
}

// Dashboard Stats Types
export interface DashboardStats {
  totalRevenue: number;
  activeUsers: number;
  totalTransactions: number;
  processingVolume: number;
}

// Pagination Types
export interface PaginationState {
  pageIndex: number;
  pageSize: number;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

// Filter Types
export interface FilterState {
  searchTerm?: string;
  status?: string;
  type?: string;
  role?: string;
  dateFrom?: string;
  dateTo?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedApiResponse<T> {
  success: boolean;
  data: T[];
  pagination: PaginationInfo;
  message?: string;
}

// Form Props Types
export interface BaseFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isLoading?: boolean;
}

export interface EditFormProps<T> extends BaseFormProps {
  initialData?: T;
  onSubmit: (data: T) => void | Promise<void>;
}

// Table Column Actions
export interface ColumnActions<T> {
  onView?: (item: T) => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
}

// Common Component Props
export interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
}

export interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: any;
  iconColor?: string;
  iconBgColor?: string;
  valueColor?: string;
  color?: 'emerald' | 'blue' | 'purple' | 'orange' | 'red' | 'yellow';
}

export interface PageHeaderProps {
  title: string;
  description?: string;
  subtitle?: string;
  actionLabel?: string;
  actionIcon?: any;
  onAction?: () => void;
  actionButton?: React.ReactNode;
  action?: React.ReactNode;
}
