import React from 'react'

export default function IncomePage({ params }: { params: { orgId: string } }) {
  const { orgId } = params;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold">Income</h2>
      <p className="text-gray-600 mt-2">Income reports for {orgId}.</p>
    </div>
  );
}
