import React from 'react'

export default function OrgReportsPage({ params }: { params: { orgId: string } }) {
  const { orgId } = params;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold">Reports</h2>
      <p className="text-gray-600 mt-2">Reports for organization {orgId}.</p>
    </div>
  );
}
