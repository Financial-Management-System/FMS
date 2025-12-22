import React from 'react'

export default function OrganizationManagementPage({ params }: { params: { orgId: string } }) {
  const { orgId } = params;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold">Organization Management</h2>
      <p className="text-gray-600 mt-2">Manage organization {orgId} settings and details here.</p>
    </div>
  );
}
