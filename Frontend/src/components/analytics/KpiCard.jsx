import React from 'react';

export default function KpiCard({ label, value }) {
  return (
    <div className="bg-base-dark p-4 rounded-lg text-center">
      <p className="text-sm text-text-darker">{label}</p>
      <p className="text-3xl font-bold text-accent-yellow mt-1">{value}</p>
    </div>
  );
}
