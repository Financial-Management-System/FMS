'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Building2, MapPin, Users, DollarSign, TrendingUp, Edit, Trash2, LogIn } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { ImageWithFallback } from '@/src/components/custom/imageWithFallback';
import { PageHeader } from '@/src/components/custom/pageHeader';
import { StatsCard } from '@/src/components/custom/statsCard';
import { EmptyState } from '@/src/components/custom/emptyState';
import { StatusBadge } from '@/src/components/custom/StatusBadge';
import { FormWrapper, FormInput, FormTextarea, FormSelect } from '@/src/components/custom';
import { OkaneSpecialsSchema, OkaneSpecialsFormData } from '@/src/schema';
import { toast } from 'react-toastify';

interface Company {
  id: string;
  name: string;
  description: string;
  image: string;
  location: string;
  employees: number;
  revenue: string;
  status: 'Active' | 'Pending' | 'Inactive';
  category: string;
}

export const initialCompanies: Company[] = [
  {
    id: '1',
    name: 'TechVision Corp',
    description: 'Leading technology solutions provider specializing in enterprise software and cloud services.',
    image: 'https://images.unsplash.com/photo-1694702740570-0a31ee1525c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjBidWlsZGluZ3xlbnwxfHx8fDE3NjU2MjQ4Mjh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    location: 'San Francisco, CA',
    employees: 250,
    revenue: '$45M',
    status: 'Active',
    category: 'Technology',
  },
  {
    id: '2',
    name: 'Global Finance Partners',
    description: 'Investment and financial services firm with a focus on sustainable growth and innovation.',
    image: 'https://images.unsplash.com/photo-1702047135360-e549c2e1f7df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNoJTIwc3RhcnR1cCUyMHdvcmtzcGFjZXxlbnwxfHx8fDE3NjU3MDU0MzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    location: 'New York, NY',
    employees: 180,
    revenue: '$32M',
    status: 'Active',
    category: 'Finance',
  },
  {
    id: '3',
    name: 'Innovative Solutions Ltd',
    description: 'Consulting firm delivering strategic business solutions across multiple industries.',
    image: 'https://images.unsplash.com/photo-1765351772260-9c7ddabe6977?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBoZWFkcXVhcnRlcnN8ZW58MXx8fHwxNzY1NzEyNzE5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    location: 'London, UK',
    employees: 120,
    revenue: '$28M',
    status: 'Active',
    category: 'Consulting',
  },
  {
    id: '4',
    name: 'Urban Development Co',
    description: 'Real estate development company focused on sustainable urban projects.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGNlbnRlcnxlbnwxfHx8fDE3NjU2Mzk5MzF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    location: 'Dubai, UAE',
    employees: 95,
    revenue: '$52M',
    status: 'Pending',
    category: 'Real Estate',
  },
];

const statusOptions = [
  { value: 'Active', label: 'Active' },
  { value: 'Pending', label: 'Pending' },
  { value: 'Inactive', label: 'Inactive' },
];

export default function OkaneSpecials() {
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>(initialCompanies);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | undefined>(undefined);

  const handleSubmit = async (data: OkaneSpecialsFormData) => {
    if (editingCompany) {
      // Update existing company
      setCompanies(prev => prev.map(c => 
        c.id === editingCompany.id 
          ? { ...c, ...data } 
          : c
      ));
      toast.success('Organization updated successfully!');
    } else {
      // Add new company
      const newCompany: Company = {
        id: (companies.length + 1).toString(),
        name: data.name,
        description: data.description,
        image: data.image || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGNlbnRlcnxlbnwxfHx8fDE3NjU2Mzk5MzF8MA&ixlib=rb-4.1.0&q=80&w=1080',
        location: data.location,
        employees: data.employees,
        revenue: data.revenue,
        status: data.status,
        category: data.category,
      };
      setCompanies(prev => [...prev, newCompany]);
      toast.success('Organization added successfully!');
    }
    
    setIsAddDialogOpen(false);
    setEditingCompany(undefined);
  };

  const handleDelete = (id: string) => {
    setCompanies(prev => prev.filter(company => company.id !== id));
    toast.success('Organization deleted successfully!');
  };

  const handleEdit = (company: Company) => {
    setEditingCompany(company);
    setIsAddDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingCompany(undefined);
    setIsAddDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <PageHeader
        title="Okane Specials"
        subtitle="Manage your special operations and company portfolios"
        actionLabel="Add Organization"
        actionIcon={Plus}
        onAction={handleAddNew}
      />


      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          icon={<Building2 className="w-6 h-6 text-emerald-600" />}
          title="Total Companies"
          value={companies.length}
          color="emerald"
        />

        <StatsCard
          icon={<TrendingUp className="w-6 h-6 text-blue-600" />}
          title="Active Operations"
          value={companies.filter(c => c.status === 'Active').length}
          color="blue"
        />

        <StatsCard
          icon={<Users className="w-6 h-6 text-purple-600" />}
          title="Total Employees"
          value={companies.reduce((sum, c) => sum + c.employees, 0).toLocaleString()}
          color="purple"
        />

        <StatsCard
          icon={<DollarSign className="w-6 h-6 text-orange-600" />}
          title="Combined Revenue"
          value="$157M"
          color="orange"
        />
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {companies.map((company) => (
          <Card key={company.id} className="overflow-hidden transition-shadow hover:shadow-lg">
            <div className="relative w-full h-48 overflow-hidden bg-gray-200">
              <ImageWithFallback
                src={company.image}
                alt={company.name}
                className="object-cover w-full h-full"
              />
              <StatusBadge
                status={company.status}
                className="absolute top-4 right-4"
              />
            </div>
            <CardHeader>
              <CardTitle>{company.name}</CardTitle>
              <CardDescription className="line-clamp-2">{company.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  {company.location}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  {company.employees.toLocaleString()} Employees
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <DollarSign className="w-4 h-4" />
                  {company.revenue} Annual Revenue
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{company.category}</Badge>
              </div>
              <Button 
                className="w-full text-white bg-emerald-600 hover:bg-emerald-700"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  router.push(`/dashboard/organizations/${company.id}`);
                }}
              >
                <LogIn className="w-4 h-4 mr-2" />
                Session
              </Button>
              <div className="flex gap-2 pt-2 border-t">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleEdit(company)}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleDelete(company.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {companies.length === 0 && (
        <EmptyState
          icon={<Building2 className="w-16 h-16 mx-auto mb-4 text-gray-400" />}
          title="No companies yet"
          subtitle="Get started by adding your first Okane Special"
          action={
            <Button
              className="text-white bg-emerald-600 hover:bg-emerald-700"
              onClick={handleAddNew}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Company
            </Button>
          }
        />
      )}

      {/* Organization Form Dialog */}
      <FormWrapper
        open={isAddDialogOpen}
        onOpenChange={(open) => {
          setIsAddDialogOpen(open);
          if (!open) setEditingCompany(undefined);
        }}
        entityName="Organization"
        schema={OkaneSpecialsSchema}
        defaultValues={{
          name: '',
          description: '',
          image: '',
          location: '',
          employees: 0,
          revenue: '',
          status: 'Active',
          category: '',
        }}
        initialData={editingCompany ? {
          name: editingCompany.name,
          description: editingCompany.description,
          category: editingCompany.category,
          location: editingCompany.location,
          employees: editingCompany.employees,
          revenue: editingCompany.revenue,
          status: editingCompany.status,
          image: editingCompany.image,
        } : undefined}
        onSubmit={handleSubmit}
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

            <FormTextarea
              control={form.control}
              name="description"
              label="Description"
              placeholder="Enter company description"
              rows={4}
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
                name="location"
                label="Location"
                placeholder="e.g., New York, NY"
              />

              <FormInput
                control={form.control}
                name="employees"
                label="Number of Employees"
                type="number"
                placeholder="e.g., 150"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormInput
                control={form.control}
                name="revenue"
                label="Annual Revenue"
                placeholder="e.g., $45M"
              />

              <FormSelect
                control={form.control}
                name="status"
                label="Status"
                options={statusOptions}
              />
            </div>

            <FormInput
              control={form.control}
              name="image"
              label="Image URL (Optional)"
              type="url"
              placeholder="https://example.com/image.jpg"
              description="Leave empty to use default image"
            />
          </>
        )}
      </FormWrapper>
    </div>
  );
}
