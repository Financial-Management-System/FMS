import React from 'react'

export default function AnalyticsPage({ params }: { params: { orgId: string } }) {
  const { orgId } = params;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold">Analytics Dashboard</h2>
      <p className="text-gray-600 mt-2">Analytics for organization {orgId}.</p>
    </div>
  );
}
