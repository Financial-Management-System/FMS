import React from 'react'

export default function FinancialOperationsPage({ params }: { params: { orgId: string } }) {
  const { orgId } = params;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold">Financial Operations</h2>
      <p className="text-gray-600 mt-2">Financial operations for {orgId} will be shown here.</p>
    </div>
  );
}
