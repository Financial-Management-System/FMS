'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Building2, MapPin, Users, DollarSign, TrendingUp, Edit, Trash2, LogIn } from 'lucide-react';
import { CardDescription, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { ImageWithFallback } from '@/src/components/custom/imageWithFallback';
import { PageHeader } from '@/src/components/custom/pageHeader';
import { StatsCard } from '@/src/components/custom/statsCard';
import { EmptyState } from '@/src/components/custom/emptyState';
import { StatusBadge } from '@/src/components/custom/StatusBadge';
import { SectionCard } from '@/src/components/custom/sectionCard';
import { OkaneSpecialsFormData } from '@/src/schema';
import { toast } from 'react-toastify';
import OrganizationForm from './orgForm';

interface Company {
  id: string;
  _id?: string;
  org_id?: string;
  name: string;
  description?: string;
  image?: string;
  location: string;
  employees?: number;
  revenue?: string;
  status: 'Active' | 'Inactive';
  category: string;
  email: string;
  phone: string;
  country: string;
}

// interface ApiResponse {
//   success: boolean;
//   data: any[];
//   meta: {
//     page: number;
//     limit: number;
//     total: number;
//     totalPages: number;
//     hasNext: boolean;
//     hasPrev: boolean;
//   };
// }

const statusOptions = [
  { value: 'Active', label: 'Active' },
  { value: 'Inactive', label: 'Inactive' },
];

export default function OkaneSpecials() {
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch organizations from API
  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/organization');
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);
        throw new Error(`Failed to fetch organizations: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result.success && result.data) {
        const transformedData: Company[] = result.data.map((org: any) => ({
          id: org._id,
          _id: org._id,
          org_id: org.org_id,
          name: org.name,
          description: org.description,
          image: org.image || '', // Ensure empty string instead of undefined/null
          location: org.location,
          employees: org.employees,
          revenue: org.revenue,
          status: org.status,
          category: org.category,
          email: org.email,
          phone: org.phone,
          country: org.country,
        }));  
        setCompanies(transformedData);
      } else {
        setCompanies([]);
      }
    } catch (err) {
      console.error('Error fetching organizations:', err);
      setError('Failed to load organizations');
      toast.error('Failed to load organizations');
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchOrganizations();
  }, []);

  const handleSubmit = async (data: OkaneSpecialsFormData) => {
    try {
      const isEditing = !!editingCompany;
      const url = isEditing ? `/api/organization/${editingCompany.id}` : '/api/organization';
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      // Handle validation errors from backend (422)
      if (response.status === 422) {
        const errorData = await response.json();
        console.log('Backend validation errors:', errorData);
        
        // Show only one consolidated error message
        if (errorData?.message) {
          toast.error(errorData.message);
        } else {
          toast.error('Please check your form data and fix the validation errors.');
        }
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to save organization');
      }

      const result = await response.json();

      if (result.success) {
        toast.success(result.message || (editingCompany ? 'Organization updated successfully!' : 'Organization added successfully!'));

        // Refresh the data from API
        await fetchOrganizations();

        setIsAddDialogOpen(false);
        setEditingCompany(undefined);
      } else {
        throw new Error(result.message || 'Failed to save organization');
      }
    } catch (error: any) {
      console.error('Submit error:', error);
      toast.error(error.message || 'Failed to save organization. Please try again.');
    }
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
        title="Organizations"
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
      {loading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-lg h-80"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="py-12 text-center">
          <p className="mb-4 text-red-600">{error}</p>
          <Button onClick={fetchOrganizations} variant="outline">
            Retry
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {companies.map((company) => (
          <SectionCard key={company.id} className="overflow-hidden transition-shadow hover:shadow-lg">
            <div className="relative w-full h-48 mb-4 -mx-6 -mt-6 overflow-hidden bg-gray-200">
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
            <div className="space-y-4">
              <div>
                <CardTitle>{company.name}</CardTitle>
                <CardDescription className="line-clamp-2">{company.description}</CardDescription>
              </div>
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
                  router.push(`/dashboard/organizations/${company.org_id}`);
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

              </div>
            </div>
          </SectionCard>
        ))}
        </div>
      )}

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

      <OrganizationForm
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        organization={editingCompany}
        mode={editingCompany ? 'edit' : 'create'}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
