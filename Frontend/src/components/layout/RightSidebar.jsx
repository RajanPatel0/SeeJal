import React from 'react';
import KpiCard from '../analytics/KpiCard';
import BarChart from '../analytics/BarChart';
import DonutChart from '../analytics/DonutChart';

export default function RightSidebar({ data }) {
  if (!data) {
    return <aside className="w-96 h-full bg-panel-dark p-4 animate-pulse"></aside>;
  }

  const { kpis, manualTelemetry, statewiseCount } = data;

  const donutData = [
    { name: 'Monitored', value: manualTelemetry.monitored },
    { name: 'Unmonitored', value: manualTelemetry.total - manualTelemetry.monitored },
  ];

  return (
    <aside className="w-96 h-full bg-panel-dark p-4 space-y-4 overflow-y-auto">
      <div className="text-center">
        <h2 className="text-lg font-semibold text-white">Data Summary</h2>
        <p className="text-sm text-text-darker">National Level Overview</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <KpiCard label="Total Stations" value={kpis.totalStations.toLocaleString()} />
        <KpiCard label="Monitored Stations" value={kpis.monitoredStations.toLocaleString()} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <DonutChart title="Manual & Telemetry" data={donutData} />
        <DonutChart title="Monitored Manual & Telemetry" data={donutData} />
      </div>
      <div>
        <BarChart data={statewiseCount} />
      </div>
    </aside>
  );
}
