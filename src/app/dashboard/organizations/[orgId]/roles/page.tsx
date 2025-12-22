import React from 'react'

export default function RolesPage({ params }: { params: { orgId: string } }) {
  const { orgId } = params;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold">Roles & Permissions</h2>
      <p className="text-gray-600 mt-2">Manage roles and permissions for {orgId}.</p>
    </div>
  );
}
