import React from 'react'

export default function HelpSupportPage({ params }: { params: { orgId: string } }) {
  const { orgId } = params;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold">Help / Support</h2>
      <p className="text-gray-600 mt-2">Help and support resources for {orgId}.</p>
    </div>
  );
}
