import React, { useMemo, useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { mockStations } from "../../utils/mockData";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ExecutiveSummary = () => {
  const summary = useMemo(() => {
    const total = mockStations.length;
    const critical = mockStations.filter((s) => s.status === "critical").length;
    const safe = mockStations.filter((s) => s.status === "safe").length;
    const improving = mockStations.filter((s) => s.trend === "increasing").length;
    const declining = mockStations.filter((s) => s.trend === "decreasing").length;
    const stable = total - (improving + declining);

    return { total, critical, safe, improving, declining, stable };
  }, []);

  // Animated counters
  const useCounter = (target) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
      let start = 0;
      const increment = target / 50;
      const interval = setInterval(() => {
        start += increment;
        if (start >= target) {
          start = target;
          clearInterval(interval);
        }
        setCount(Math.floor(start));
      }, 20);
      return () => clearInterval(interval);
    }, [target]);
    return count;
  };

  const data = {
    labels: ["Critical", "Improving", "Stable", "Declining"],
    datasets: [
      {
        label: "Zone Count",
        data: [summary.critical, summary.improving, summary.stable, summary.declining],
        backgroundColor: [
          "rgba(244, 63, 94, 0.8)",
          "rgba(16, 185, 129, 0.8)",
          "rgba(107, 114, 128, 0.8)",
          "rgba(251, 191, 36, 0.8)",
        ],
        borderRadius: 8,
        barThickness: 32,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true, callbacks: { label: (ctx) => `Count: ${ctx.raw}` } },
    },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 } },
    },
  };

  const topCritical = mockStations
    .filter((s) => s.status === "critical")
    .slice(0, 5)
    .map((s) => s.name);

  const [showTop, setShowTop] = useState(true);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
      <h2 className="text-3xl font-bold mb-4">📊 Executive Summary Dashboard</h2>
      <p className="text-gray-600 mb-6">Quick glance overview of groundwater conditions.</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <SummaryCard label="Total Stations" value={useCounter(summary.total)} color="text-blue-600" />
        <SummaryCard label="Critical Zones" value={useCounter(summary.critical)} color="text-red-600" />
        <SummaryCard label="Improving Zones" value={useCounter(summary.improving)} color="text-green-600" />
        <SummaryCard label="Stable Zones" value={useCounter(summary.stable)} color="text-gray-700" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-64 p-4 bg-gray-50 rounded-lg shadow-inner">
          <Bar data={data} options={options} />
        </div>

        <div className="bg-gray-50 rounded-lg p-4 shadow-inner">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-dark">Top 5 Critical Stations</h3>
            <button
              onClick={() => setShowTop(!showTop)}
              className="text-blue-600 font-medium hover:underline"
            >
              {showTop ? "Hide" : "Show"}
            </button>
          </div>
          {showTop && (
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {topCritical.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

const SummaryCard = ({ label, value, color }) => (
  <div className="p-4 rounded-xl text-center shadow-lg bg-gradient-to-r from-indigo-50 to-indigo-100 hover:scale-105 transform transition">
    <div className={`text-4xl font-bold ${color}`}>{value}</div>
    <div className="text-gray-700 mt-1">{label}</div>
  </div>
);

export default ExecutiveSummary;
