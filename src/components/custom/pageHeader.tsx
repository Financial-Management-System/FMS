import { LucideIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  subtitle?: string;
  actionLabel?: string;
  actionIcon?: LucideIcon;
  onAction?: () => void;
  actionButton?: ReactNode;
  action?: ReactNode;
}

export function PageHeader({
  title,
  description,
  subtitle,
  actionLabel,
  actionIcon: ActionIcon,
  onAction,
  actionButton,
  action,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div>
        <h2 className="text-2xl">{title}</h2>
        <p className="text-gray-600 mt-1">{description || subtitle}</p>
      </div>
      {action || actionButton || (actionLabel && onAction && (
        <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={onAction}>
          {ActionIcon && <ActionIcon className="w-4 h-4 mr-2" />}
          {actionLabel}
        </Button>
      ))}
    </div>
  );
}