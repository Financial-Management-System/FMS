import React from 'react'

export default function OrgSettingsPage({ params }: { params: { orgId: string } }) {
  const { orgId } = params;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold">Organization Settings</h2>
      <p className="text-gray-600 mt-2">Settings for organization {orgId} go here.</p>
    </div>
  );
}
