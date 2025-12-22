import React from 'react'

export default function ApprovalRulesPage({ params }: { params: { orgId: string } }) {
  const { orgId } = params;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold">Approval Rules</h2>
      <p className="text-gray-600 mt-2">Configure approval rules for {orgId}.</p>
    </div>
  );
}
