import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/src/components/ui/dialog';
import { Form } from '@/src/components/ui/form';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';

interface FormWrapperProps<T extends z.ZodType<any, any, any>> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schema: T;
  defaultValues: z.infer<T>;
  onSubmit: (data: z.infer<T>) => void | Promise<void>;
  initialData?: z.infer<T>;
  entityName?: string;
  isLoading?: boolean;
  children: (form: ReturnType<typeof useForm<z.infer<T>>>) => React.ReactNode;
  title?: string;
  description?: string;
  submitLabel?: string;
  cancelLabel?: string;
  className?: string;
}

export function FormWrapper<T extends z.ZodType<any, any, any>>({
  open,
  onOpenChange,
  schema,
  defaultValues,
  onSubmit,
  initialData,
  entityName = 'Item',
  isLoading = false,
  children,
  title,
  description,
  submitLabel,
  cancelLabel = 'Cancel',
  className,
}: FormWrapperProps<T>) {
  const isEditMode = !!initialData;
  
  // Auto-generate title and description if not provided
  const dialogTitle = title || (isEditMode ? `Edit ${entityName}` : `Add ${entityName}`);
  const dialogDescription = description || (isEditMode 
    ? `Update the ${entityName.toLowerCase()} details below.`
    : `Fill in the details to create a new ${entityName.toLowerCase()}.`);
  const buttonLabel = submitLabel || (isEditMode ? 'Update' : 'Create');

  const form = useForm<z.infer<T>>({
    resolver: zodResolver(schema) as any,
    defaultValues: defaultValues,
  });

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    } else {
      form.reset(defaultValues);
    }
  }, [initialData, form, defaultValues]);

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      form.reset(defaultValues);
    }
  }, [open, form, defaultValues]);

  const handleSubmit = async (data: z.infer<T>) => {
    try {
      await onSubmit(data);
      form.reset(defaultValues);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={className || 'sm:max-w-[500px] max-h-[90vh]'}>
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {/* Scrollable form area */}
            <div className="max-h-[calc(90vh-200px)] overflow-y-auto pr-2 space-y-4">
              {children(form)}
            </div>

            {/* Fixed action buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  onOpenChange(false);
                  form.reset(defaultValues);
                }}
                disabled={isLoading}
              >
                {cancelLabel}
              </Button>
              <Button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {buttonLabel}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
