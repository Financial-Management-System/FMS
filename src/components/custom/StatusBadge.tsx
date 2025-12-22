import { Badge } from '../ui/badge';

interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  className?: string;
}

const statusStyles: Record<string, string> = {
  // Transaction and general statuses
  Completed: 'bg-emerald-100 text-emerald-700',
  Active: 'bg-emerald-100 text-emerald-700',
  Pending: 'bg-yellow-100 text-yellow-700',
  Failed: 'bg-red-100 text-red-700',
  Suspended: 'bg-red-100 text-red-700',
  Inactive: 'bg-gray-100 text-gray-700',
  
  // User roles
  Enterprise: 'bg-purple-100 text-purple-700',
  Premium: 'bg-blue-100 text-blue-700',
  Standard: 'bg-gray-100 text-gray-700',
};

export function StatusBadge({ status, variant = 'secondary', className }: StatusBadgeProps) {
  const statusClassName = statusStyles[status] || 'bg-gray-100 text-gray-700';
  
  return (
    <Badge variant={variant} className={`${statusClassName} ${className || ''}`}>
      {status}
    </Badge>
  );
}
