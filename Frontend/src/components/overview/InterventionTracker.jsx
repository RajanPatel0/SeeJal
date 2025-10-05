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

const InterventionTracker = () => {
  const dataSummary = useMemo(() => {
    const stationsWithIntervention = mockStations.slice(0, 10).map((station) => ({
      name: station.name,
      before: parseFloat((station.currentLevel + Math.random() * 3).toFixed(2)), // simulate before
      after: parseFloat(station.currentLevel.toFixed(2)),
    }));

    const averageChange =
      stationsWithIntervention.reduce((acc, s) => acc + (s.before - s.after), 0) /
      stationsWithIntervention.length;

    return { stationsWithIntervention, averageChange };
  }, []);

  // Animated counter for average improvement
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
        setCount(parseFloat(start.toFixed(2)));
      }, 20);
      return () => clearInterval(interval);
    }, [target]);
    return count;
  };

  const animatedAverage = useCounter(dataSummary.averageChange);

  const chartData = {
    labels: dataSummary.stationsWithIntervention.map((s) => s.name),
    datasets: [
      {
        label: "Before Intervention",
        data: dataSummary.stationsWithIntervention.map((s) => s.before),
        backgroundColor: "rgba(245,158,11,0.8)",
        borderRadius: 6,
      },
      {
        label: "After Intervention",
        data: dataSummary.stationsWithIntervention.map((s) => s.after),
        backgroundColor: "rgba(14,159,110,0.8)",
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // makes chart responsive
    plugins: {
      legend: { position: "top" },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.dataset.label}: ${ctx.raw} m`,
        },
      },
    },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 } },
    },
  };

  const [showSummary, setShowSummary] = useState(true);

  // Highlight top improving station
  const topImprovement = dataSummary.stationsWithIntervention.reduce(
    (prev, current) =>
      current.before - current.after > prev.before - prev.after ? current : prev,
    dataSummary.stationsWithIntervention[0]
  );

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
      <h2 className="text-3xl font-bold mb-4 text-center md:text-left">
        📍 Intervention Impact Tracker
      </h2>
      <p className="text-gray-600 mb-6 text-center md:text-left">
        Evaluate how policy interventions are improving groundwater levels.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Chart */}
        <div className="w-full h-72 md:h-80 p-4 bg-gray-50 rounded-lg shadow-inner hover:shadow-lg transition">
          <Bar data={chartData} options={options} />
        </div>

        {/* Summary */}
        <div className="bg-gray-50 rounded-lg p-4 shadow-inner hover:shadow-lg transition flex flex-col justify-center">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-dark">Summary</h3>
            <button
              onClick={() => setShowSummary(!showSummary)}
              className="text-blue-600 font-medium hover:underline text-sm md:text-base"
            >
              {showSummary ? "Hide" : "Show"}
            </button>
          </div>
          {showSummary && (
            <>
              <p className="text-gray-700 mb-2">
                Average improvement:{" "}
                <span className="font-bold text-green-700">{animatedAverage} m</span>
              </p>
              <p className="text-gray-700 mb-2">
                Out of {dataSummary.stationsWithIntervention.length} intervention sites,
                majority show positive improvement.
              </p>
              <p className="text-gray-700">
                Top improving station:{" "}
                <span className="font-bold text-indigo-600">{topImprovement.name}</span>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterventionTracker;
