import React, { useMemo } from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { mockStations } from "../../utils/mockData";

ChartJS.register(ArcElement, Tooltip, Legend);

const ResourceAdvisor = () => {
  const rankedStates = useMemo(() => {
    const grouped = {};

    mockStations.forEach((s) => {
      if (!grouped[s.state]) grouped[s.state] = { critical: 0, total: 0 };
      grouped[s.state].total++;
      if (s.status === "critical") grouped[s.state].critical++;
    });

    const result = Object.entries(grouped).map(([state, data]) => ({
      state,
      urgency: (data.critical / data.total) * 100,
    }));

    return result.sort((a, b) => b.urgency - a.urgency).slice(0, 5);
  }, []);

  const chartData = {
    labels: rankedStates.map((s) => s.state),
    datasets: [
      {
        data: rankedStates.map((s) => s.urgency.toFixed(1)),
        backgroundColor: ["#ef4444", "#f59e0b", "#eab308", "#3b82f6", "#10b981"],
      },
    ],
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h2 className="text-2xl font-semibold mb-4">💰 Resource Allocation Advisor</h2>
      <p className="text-gray-600 mb-4">
        Prioritize funding and interventions based on criticality and population impact.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="h-72">
          <Doughnut data={chartData} />
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-dark mb-2">Top Priority States</h3>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 font-medium">State</th>
                <th className="text-right py-2 font-medium">% Urgency</th>
                <th className="text-right py-2 font-medium">Suggested Action</th>
              </tr>
            </thead>
            <tbody>
              {rankedStates.map((s, i) => (
                <tr key={i} className="border-b">
                  <td className="py-2">{s.state}</td>
                  <td className="text-right py-2">{s.urgency.toFixed(1)}%</td>
                  <td className="text-right py-2 text-blue-600">
                    {s.urgency > 40
                      ? "Recharge Projects"
                      : s.urgency > 25
                      ? "Awareness Campaign"
                      : "Monitoring Upgrade"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ResourceAdvisor;
