import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface DataTableDropdownFilterProps {
  table: any;
  columnKey: string;
  options: string[];
  placeholder?: string;
  className?: string;
}

export function DataTableDropdownFilter({
  table,
  columnKey,
  options,
  placeholder = 'Select...',
  className,
}: DataTableDropdownFilterProps) {
  const currentValue = (table.getColumn(columnKey)?.getFilterValue() as string) ?? '';

  return (
    <Select
      value={currentValue}
      onValueChange={(value) => {
        table.getColumn(columnKey)?.setFilterValue(value === 'all' ? '' : value);
      }}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Categories</SelectItem>
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}