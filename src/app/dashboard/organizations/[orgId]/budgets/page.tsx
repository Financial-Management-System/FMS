import React from 'react'

export default function BudgetsPage({ params }: { params: { orgId: string } }) {
  const { orgId } = params;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold">Budgets</h2>
      <p className="text-gray-600 mt-2">Budget planning and allocations for {orgId}.</p>
    </div>
  );
}
