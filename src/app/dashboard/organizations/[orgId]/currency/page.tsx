import React from 'react'

export default function CurrencySettingsPage({ params }: { params: { orgId: string } }) {
  const { orgId } = params;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold">Currency Settings</h2>
      <p className="text-gray-600 mt-2">Currency and exchange settings for {orgId}.</p>
    </div>
  );
}
