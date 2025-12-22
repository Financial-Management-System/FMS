import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon | ReactNode;
  iconColor?: string;
  iconBgColor?: string;
  valueColor?: string;
  color?: 'emerald' | 'blue' | 'purple' | 'orange' | 'red' | 'yellow';
}

const colorMap = {
  emerald: { icon: 'text-emerald-600', bg: 'bg-emerald-100', value: 'text-gray-900' },
  blue: { icon: 'text-blue-600', bg: 'bg-blue-100', value: 'text-gray-900' },
  purple: { icon: 'text-purple-600', bg: 'bg-purple-100', value: 'text-gray-900' },
  orange: { icon: 'text-orange-600', bg: 'bg-orange-100', value: 'text-gray-900' },
  red: { icon: 'text-red-600', bg: 'bg-red-100', value: 'text-red-600' },
  yellow: { icon: 'text-yellow-600', bg: 'bg-yellow-100', value: 'text-yellow-600' },
};

export function StatsCard({
  title,
  value,
  icon,
  iconColor,
  iconBgColor,
  valueColor,
  color,
}: StatsCardProps) {
  const colors = color ? colorMap[color] : null;
  
  const finalIconColor = iconColor || (colors?.icon) || 'text-emerald-600';
  const finalIconBgColor = iconBgColor || (colors?.bg) || 'bg-emerald-100';
  const finalValueColor = valueColor || (colors?.value) || 'text-gray-900';

  const renderIcon = () => {
    if (!icon) return null;
    
    // Check if icon is a React element
    if (typeof icon === 'object' && 'type' in icon) {
      return icon;
    }
    
    // Otherwise treat as a LucideIcon component
    const IconComponent = icon as LucideIcon;
    return <IconComponent className={`w-6 h-6 ${finalIconColor}`} />;
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">{title}</p>
            <p className={`text-2xl mt-1 ${finalValueColor}`}>{value}</p>
          </div>
          {icon && (
            <div className={`w-12 h-12 rounded-lg ${finalIconBgColor} flex items-center justify-center`}>
              {renderIcon()}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
