import React from 'react'

export default function ExpensesPage({ params }: { params: { orgId: string } }) {
  const { orgId } = params;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold">Expenses</h2>
      <p className="text-gray-600 mt-2">Expenses for organization {orgId}.</p>
    </div>
  );
}
