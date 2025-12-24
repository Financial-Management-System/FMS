'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/src/components/ui/button'; 
import { Input } from '@/src/components/ui/input'; 
import { X } from 'lucide-react';

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'number' | 'tel' | 'textarea' | 'select';
  placeholder?: string;
  options?: string[];
}

interface FormDialogProps<T extends z.ZodType<any, any>> {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: z.infer<T>) => void;
  title: string;
  description: string;
  schema: T;
  fields: FormField[];
  defaultValues?: Partial<z.infer<T>>;
  submitLabel?: string;
}

export default function FormDialog<T extends z.ZodType<any, any>>({
  open,
  onClose,
  onSubmit,
  title,
  description,
  schema,
  fields,
  defaultValues,
  submitLabel = 'Submit',
}: FormDialogProps<T>) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as any,
  });

  if (!open) return null;

  const onSubmitHandler = (data: z.infer<T>) => {
    onSubmit(data);
    reset();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-white bg-opacity-50 z-50 flex items-center justify-center p-4 ">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl">{title}</h2>
              <p className="text-sm text-gray-600 mt-1">{description}</p>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmitHandler)} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-4">
            {fields.map((field) => (
              <div key={field.name}>
                <label htmlFor={field.name} className="block text-sm mb-2">
                  {field.label}
                </label>
                {field.type === 'textarea' ? (
                  <textarea
                    id={field.name}
                    {...register(field.name)}
                    placeholder={field.placeholder}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    rows={3}
                  />
                ) : field.type === 'select' && field.options ? (
                  <select
                    id={field.name}
                    {...register(field.name)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="">Select {field.label}</option>
                    {field.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : field.type === 'number' ? (
                  <Input
                    id={field.name}
                    type="number"
                    {...register(field.name, { valueAsNumber: true })}
                    placeholder={field.placeholder}
                  />
                ) : (
                  <Input
                    id={field.name}
                    type={field.type}
                    {...register(field.name)}
                    placeholder={field.placeholder}
                  />
                )}
                {errors[field.name] && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors[field.name]?.message as string}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">{submitLabel}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}