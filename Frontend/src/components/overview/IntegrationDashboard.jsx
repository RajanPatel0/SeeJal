import React from "react";
import { mockStations, getSummaryStats } from "../../utils/mockData";

const IntegrationDashboard = () => {
  const summary = getSummaryStats();

  const widgets = [
    { id: 1, title: "Total Stations", value: summary.total },
    { id: 2, title: "Safe Stations", value: summary.normal },
    { id: 3, title: "Semi-Critical Stations", value: summary.semiCritical },
    { id: 4, title: "Critical Stations", value: summary.critical },
    { id: 5, title: "Simulations Running", value: mockStations.length }, // Example: 1 simulation per station
    { id: 6, title: "Public Feedback", value: "12 New" }, // Placeholder if feedback tracking implemented
  ];

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-semibold text-dark mb-4">Integration Dashboard</h2>
      <p className="text-gray-600 mb-4">
        Monitor integration of multiple datasets, policies, and simulations in a single dashboard.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {widgets.map((widget) => (
          <div
            key={widget.id}
            className="p-4 bg-gray-50 rounded shadow text-center flex flex-col items-center"
          >
            <h3 className="text-lg font-medium">{widget.title}</h3>
            <p className="text-2xl font-bold text-blue-600 mt-2">{widget.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IntegrationDashboard;
