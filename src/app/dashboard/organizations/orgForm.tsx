import { OkaneSpecialsSchema } from '@/src/schema';
import { z } from 'zod';
import { FormWrapper } from '@/src/components/custom/formWrapper';
import { FormInput, FormTextarea, FormSelect } from '@/src/components/custom';
import { toast } from 'react-toastify';
import { useState, useCallback } from 'react';

type OrgFormData = z.infer<typeof OkaneSpecialsSchema>;

interface Company {
  id: string;
  name: string;
  image: string;
  location: string;
  status: 'Active' | 'Inactive';
  category: string;
  email: string;
  phone: string;
  country: string;
  description?: string;
  employees?: number;
  revenue?: string;
}

interface OrganizationFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  organization?: Company | null;
  mode: 'create' | 'edit';
  onSubmit: (data: OrgFormData) => Promise<void>;
}

const statusOptions = [
  { value: 'Active', label: 'Active' },
  { value: 'Pending', label: 'Pending' },
  { value: 'Inactive', label: 'Inactive' },
];

export default function OrganizationForm({
  isOpen,
  onOpenChange,
  organization,
  mode,
  onSubmit,
}: OrganizationFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const defaultValues = {
    name: organization?.name || '',
    category: organization?.category || '',
    email: organization?.email || '',
    phone: organization?.phone || '',
    location: organization?.location || '',
    country: organization?.country || '',
    description: organization?.description || '',
    employees: organization?.employees || undefined,
    revenue: organization?.revenue || '',
    image: organization?.image || '',
    status: organization?.status || 'Active' as const,
  };

  const initialData = organization ? {
    name: organization.name,
    category: organization.category,
    email: organization.email,
    phone: organization.phone,
    location: organization.location,
    country: organization.country,
    description: organization.description || '',
    employees: organization.employees || undefined,
    revenue: organization.revenue || '',
    image: organization.image || '',
    status: organization.status,
  } : undefined;

  const handleSubmit = async (data: OrgFormData) => {
    console.log('Form data being submitted:', data);
    
    try {
      setIsLoading(true);
      await onSubmit(data);
      
      onOpenChange(false);
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('Failed to process organization. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormWrapper
      open={isOpen}
      onOpenChange={onOpenChange}
      entityName="Organization"
      schema={OkaneSpecialsSchema}
      defaultValues={defaultValues}
      initialData={initialData}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      className="sm:max-w-2xl"
    >
      {(form) => (
        <>
          <FormInput
            control={form.control}
            name="name"
            label="Company Name"
            placeholder="Enter company name"
          />

          <FormInput
            control={form.control}
            name="category"
            label="Category"
            placeholder="e.g., Technology, Finance, Real Estate"
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormInput
              control={form.control}
              name="email"
              label="Email"
              type="email"
              placeholder="company@example.com"
            />

            <FormInput
              control={form.control}
              name="phone"
              label="Phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormInput
              control={form.control}
              name="country"
              label="Country"
              placeholder="e.g., United States"
            />

            <FormInput
              control={form.control}
              name="location"
              label="Location"
              placeholder="e.g., New York, NY"
            />
          </div>

          <FormTextarea
            control={form.control}
            name="description"
            label="Description"
            placeholder="Brief description of the organization..."
            rows={3}
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormInput
              control={form.control}
              name="employees"
              label="Number of Employees"
              type="number"
              placeholder="e.g., 250"
            />

            <FormInput
              control={form.control}
              name="revenue"
              label="Annual Revenue"
              placeholder="e.g., $45M"
            />
          </div>

          <FormInput
            control={form.control}
            name="image"
            label="Company Logo URL (Optional)"
            placeholder="https://example.com/logo.jpg"
          />

          <FormSelect
            control={form.control}
            name="status"
            label="Status"
            options={statusOptions}
          />
      
        </>
      )}
    </FormWrapper>
  );
}