import React from 'react'

export default function ApprovalsPage({ params }: { params: { orgId: string } }) {
  const { orgId } = params;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold">Approvals</h2>
      <p className="text-gray-600 mt-2">Approval requests and status for {orgId}.</p>
    </div>
  );
}
