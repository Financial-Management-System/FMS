import React from 'react'

export default function DepartmentsPage({ params }: { params: { orgId: string } }) {
  const { orgId } = params;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold">Departments / Projects</h2>
      <p className="text-gray-600 mt-2">Manage departments and projects for {orgId}.</p>
    </div>
  );
}
