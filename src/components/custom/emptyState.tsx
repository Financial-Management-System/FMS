import { LucideIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: LucideIcon | ReactNode;
  title: string;
  description?: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  action?: ReactNode;
}

export function EmptyState({
  icon,
  title,
  description,
  subtitle,
  actionLabel,
  onAction,
  action,
}: EmptyStateProps) {
  const renderIcon = () => {
    if (!icon) return null;
    
    // Check if icon is a React element
    if (typeof icon === 'object' && 'type' in icon) {
      return icon;
    }
    
    // Otherwise treat as a LucideIcon component
    const IconComponent = icon as LucideIcon;
    return <IconComponent className="w-16 h-16 text-gray-400 mx-auto mb-4" />;
  };

  return (
    <Card className="p-12">
      <div className="text-center">
        {renderIcon()}
        <h3 className="text-xl text-gray-600 mb-2">{title}</h3>
        <p className="text-gray-500 mb-6">{description || subtitle}</p>
        {action || (actionLabel && onAction && (
          <Button
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
            onClick={onAction}
          >
            {actionLabel}
          </Button>
        ))}
      </div>
    </Card>
  );
}
