import { Control, FieldPath, FieldValues } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Textarea } from '../ui/textarea';

interface FormTextareaProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  description?: string;
  rows?: number;
}

export function FormTextarea<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  disabled = false,
  className,
  description,
  rows = 4,
}: FormTextareaProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Textarea
              placeholder={placeholder || `Enter ${label.toLowerCase()}`}
              disabled={disabled}
              rows={rows}
              {...field}
              value={field.value ?? ''}
            />
          </FormControl>
          {description && (
            <p className="text-sm text-gray-500">{description}</p>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
