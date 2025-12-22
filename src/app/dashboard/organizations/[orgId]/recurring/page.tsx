import React from 'react'

export default function RecurringPage({ params }: { params: { orgId: string } }) {
  const { orgId } = params;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold">Recurring Expenses</h2>
      <p className="text-gray-600 mt-2">Recurring expenses for {orgId}.</p>
    </div>
  );
}
