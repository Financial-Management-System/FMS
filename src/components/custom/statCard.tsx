import { Card } from '../ui/card';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '../ui/utils';

interface StatCardProps {
  title: string;
  value?: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'emerald' | 'red' | 'blue' | 'yellow' | 'purple' | 'orange' | 'gray' | 'gradient-emerald' | 'gradient-blue' | 'gradient-purple';
  size?: 'small' | 'medium' | 'large';
  mode?: 'stat' | 'navigation';
  className?: string;
  trend?: 'up' | 'down' | 'neutral';
  change?: string; // e.g., "+12.5%" or "-3.2%"
  onClick?: () => void;
  active?: boolean;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'emerald',
  size = 'medium',
  mode = 'stat',
  className,
  trend,
  change,
  onClick,
  active = false
}: StatCardProps) {
  
  const getVariantClasses = () => {
    switch (variant) {
      case 'emerald':
        return {
          iconBg: 'bg-emerald-100',
          iconColor: 'text-emerald-600',
          valueColor: 'text-emerald-600',
          activeBorder: 'border-emerald-500',
          activeBg: 'bg-emerald-50',
          activeText: 'text-emerald-700',
          activeIconBg: 'bg-emerald-600',
          activeIconColor: 'text-white',
          hoverBorder: 'hover:border-emerald-300'
        };
      case 'red':
        return {
          iconBg: 'bg-red-100',
          iconColor: 'text-red-600',
          valueColor: 'text-red-600',
          activeBorder: 'border-red-500',
          activeBg: 'bg-red-50',
          activeText: 'text-red-700',
          activeIconBg: 'bg-red-600',
          activeIconColor: 'text-white',
          hoverBorder: 'hover:border-red-300'
        };
      case 'blue':
        return {
          iconBg: 'bg-blue-100',
          iconColor: 'text-blue-600',
          valueColor: 'text-blue-600',
          activeBorder: 'border-blue-500',
          activeBg: 'bg-blue-50',
          activeText: 'text-blue-700',
          activeIconBg: 'bg-blue-600',
          activeIconColor: 'text-white',
          hoverBorder: 'hover:border-blue-300'
        };
      case 'yellow':
        return {
          iconBg: 'bg-yellow-100',
          iconColor: 'text-yellow-600',
          valueColor: 'text-yellow-600',
          activeBorder: 'border-yellow-500',
          activeBg: 'bg-yellow-50',
          activeText: 'text-yellow-700',
          activeIconBg: 'bg-yellow-600',
          activeIconColor: 'text-white',
          hoverBorder: 'hover:border-yellow-300'
        };
      case 'purple':
        return {
          iconBg: 'bg-purple-100',
          iconColor: 'text-purple-600',
          valueColor: 'text-purple-600',
          activeBorder: 'border-purple-500',
          activeBg: 'bg-purple-50',
          activeText: 'text-purple-700',
          activeIconBg: 'bg-purple-600',
          activeIconColor: 'text-white',
          hoverBorder: 'hover:border-purple-300'
        };
      case 'orange':
        return {
          iconBg: 'bg-orange-100',
          iconColor: 'text-orange-600',
          valueColor: 'text-orange-600',
          activeBorder: 'border-orange-500',
          activeBg: 'bg-orange-50',
          activeText: 'text-orange-700',
          activeIconBg: 'bg-orange-600',
          activeIconColor: 'text-white',
          hoverBorder: 'hover:border-orange-300'
        };
      case 'gray':
        return {
          iconBg: 'bg-gray-100',
          iconColor: 'text-gray-600',
          valueColor: 'text-gray-900',
          activeBorder: 'border-gray-500',
          activeBg: 'bg-gray-50',
          activeText: 'text-gray-700',
          activeIconBg: 'bg-gray-600',
          activeIconColor: 'text-white',
          hoverBorder: 'hover:border-gray-300'
        };
      case 'gradient-emerald':
        return {
          iconBg: 'bg-emerald-100',
          iconColor: 'text-emerald-600',
          valueColor: 'text-emerald-600',
          activeBorder: 'border-emerald-500',
          activeBg: 'bg-emerald-50',
          activeText: 'text-emerald-700',
          activeIconBg: 'bg-emerald-600',
          activeIconColor: 'text-white',
          hoverBorder: 'hover:border-emerald-300'
        };
      case 'gradient-blue':
        return {
          iconBg: 'bg-blue-100',
          iconColor: 'text-blue-600',
          valueColor: 'text-blue-600',
          activeBorder: 'border-blue-500',
          activeBg: 'bg-blue-50',
          activeText: 'text-blue-700',
          activeIconBg: 'bg-blue-600',
          activeIconColor: 'text-white',
          hoverBorder: 'hover:border-blue-300'
        };
      case 'gradient-purple':
        return {
          iconBg: 'bg-purple-100',
          iconColor: 'text-purple-600',
          valueColor: 'text-purple-600',
          activeBorder: 'border-purple-500',
          activeBg: 'bg-purple-50',
          activeText: 'text-purple-700',
          activeIconBg: 'bg-purple-600',
          activeIconColor: 'text-white',
          hoverBorder: 'hover:border-purple-300'
        };
      default:
        return {
          iconBg: 'bg-emerald-100',
          iconColor: 'text-emerald-600',
          valueColor: 'text-emerald-600',
          activeBorder: 'border-emerald-500',
          activeBg: 'bg-emerald-50',
          activeText: 'text-emerald-700',
          activeIconBg: 'bg-emerald-600',
          activeIconColor: 'text-white',
          hoverBorder: 'hover:border-emerald-300'
        };
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return {
          padding: 'p-3',
          iconSize: 'w-4 h-4',
          iconContainer: 'w-8 h-8',
          titleSize: 'text-xs',
          valueSize: 'text-lg',
          subtitleSize: 'text-xs'
        };
      case 'medium':
        return {
          padding: 'p-4',
          iconSize: 'w-5 h-5',
          iconContainer: 'w-12 h-12',
          titleSize: 'text-sm',
          valueSize: 'text-2xl',
          subtitleSize: 'text-xs'
        };
      case 'large':
        return {
          padding: 'p-6',
          iconSize: 'w-6 h-6',
          iconContainer: 'w-14 h-14',
          titleSize: 'text-base',
          valueSize: 'text-3xl',
          subtitleSize: 'text-sm'
        };
      default:
        return {
          padding: 'p-4',
          iconSize: 'w-5 h-5',
          iconContainer: 'w-12 h-12',
          titleSize: 'text-sm',
          valueSize: 'text-2xl',
          subtitleSize: 'text-xs'
        };
    }
  };

  const variantClasses = getVariantClasses();
  const sizeClasses = getSizeClasses();

  // Check if it's a gradient variant
  const isGradient = variant?.startsWith('gradient-');
  
  // Get gradient background class
  const getGradientBg = () => {
    switch (variant) {
      case 'gradient-emerald':
        return 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0';
      case 'gradient-blue':
        return 'bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0';
      case 'gradient-purple':
        return 'bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0';
      default:
        return '';
    }
  };

  // Navigation mode - centered layout
  if (mode === 'navigation') {
    return (
      <Card 
        className={cn(
          'cursor-pointer transition-all hover:shadow-lg',
          active ? `${variantClasses.activeBorder} shadow-md ${variantClasses.activeBg}` : variantClasses.hoverBorder,
          className
        )}
        onClick={onClick}
      >
        <div className={cn('flex flex-col items-center justify-center gap-3', sizeClasses.padding)}>
          <div className={cn(
            'rounded-lg flex items-center justify-center',
            sizeClasses.iconContainer,
            active ? `${variantClasses.activeIconBg} ${variantClasses.activeIconColor}` : `${variantClasses.iconBg} ${variantClasses.iconColor}`
          )}>
            <Icon className={cn(sizeClasses.iconSize)} />
          </div>
          <span className={cn(
            'text-center',
            sizeClasses.titleSize,
            active ? variantClasses.activeText : 'text-gray-700'
          )}>
            {title}
          </span>
        </div>
      </Card>
    );
  }

  // Stat mode with gradient support
  if (isGradient) {
    return (
      <Card 
        className={cn(
          sizeClasses.padding,
          getGradientBg(),
          onClick && 'cursor-pointer hover:shadow-md transition-shadow',
          className
        )}
        onClick={onClick}
      >
        <div className="flex items-center justify-between mb-2">
          <div className={cn('rounded-lg', sizeClasses.padding, 'bg-white bg-opacity-20')}>
            <Icon className={cn(sizeClasses.iconSize, 'text-white')} />
          </div>
        </div>
        <div>
          <p className={cn(sizeClasses.titleSize, variant === 'gradient-emerald' ? 'text-emerald-100' : variant === 'gradient-blue' ? 'text-blue-100' : 'text-purple-100')}>{title}</p>
          {value !== undefined && (
            <p className={cn(sizeClasses.valueSize, 'mt-2 text-white')}>
              {value}
            </p>
          )}
          {subtitle && (
            <p className={cn(sizeClasses.subtitleSize, 'mt-2', variant === 'gradient-emerald' ? 'text-emerald-100' : variant === 'gradient-blue' ? 'text-blue-100' : 'text-purple-100')}>{subtitle}</p>
          )}
        </div>
      </Card>
    );
  }

  // Stat mode - horizontal layout with value
  return (
    <Card 
      className={cn(
        sizeClasses.padding,
        onClick && 'cursor-pointer hover:shadow-md transition-shadow',
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={cn('rounded-lg', sizeClasses.padding, variantClasses.iconBg)}>
          <Icon className={cn(sizeClasses.iconSize, variantClasses.iconColor)} />
        </div>
        {(trend || change) && (
          <div className={cn(
            'flex items-center gap-1 text-sm',
            trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'
          )}>
            {trend === 'up' && <TrendingUp className="w-4 h-4" />}
            {trend === 'down' && <TrendingDown className="w-4 h-4" />}
            {change && <span>{change}</span>}
          </div>
        )}
      </div>
      <div>
        <p className={cn(sizeClasses.titleSize, 'text-gray-600')}>{title}</p>
        {value !== undefined && (
          <p className={cn(sizeClasses.valueSize, 'mt-1')}>
            {value}
          </p>
        )}
        {subtitle && (
          <p className={cn(sizeClasses.subtitleSize, 'text-gray-500 mt-1')}>{subtitle}</p>
        )}
      </div>
    </Card>
  );
}