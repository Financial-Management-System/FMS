import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

interface SelectOption {
  value: string;
  label: string;
}

interface StandaloneSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  options: SelectOption[];
  className?: string;
  disabled?: boolean;
}

export function StandaloneSelect({
  value,
  onValueChange,
  placeholder,
  label,
  options,
  className,
  disabled = false,
}: StandaloneSelectProps) {
  return (
    <div className={label ? 'space-y-2' : ''}>
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger className={className || 'w-full lg:w-[180px]'}>
          <SelectValue placeholder={placeholder || 'Select an option'} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}