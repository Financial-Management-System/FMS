import { ReactNode } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '../ui/utils';

interface SectionCardProps {
  title?: string;
  description?: string;
  children: ReactNode;
  icon?: LucideIcon;
  headerAction?: ReactNode;
  footer?: ReactNode;
  className?: string;
  contentClassName?: string;
  noPadding?: boolean;
}

export function SectionCard({
  title,
  description,
  children,
  icon: Icon,
  headerAction,
  footer,
  className,
  contentClassName,
  noPadding = false,
}: SectionCardProps) {
  return (
    <Card className={className}>
      {(title || description || Icon || headerAction) && (
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-3 flex-1">
            {Icon && (
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <Icon className="w-5 h-5 text-emerald-600" />
              </div>
            )}
            <div>
              {title && <CardTitle>{title}</CardTitle>}
              {description && <CardDescription>{description}</CardDescription>}
            </div>
          </div>
          {headerAction && <div>{headerAction}</div>}
        </CardHeader>
      )}
      <CardContent className={cn(noPadding && 'p-0', contentClassName)}>
        {children}
      </CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  );
}
