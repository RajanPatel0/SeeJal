import React, { useMemo, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { mockStations } from "../../utils/mockData";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Forecasting = () => {
  const [selectedStationId, setSelectedStationId] = useState(mockStations[0].id);

  const forecastData = useMemo(() => {
    const station = mockStations.find((s) => s.id === selectedStationId);
    const baseLevel = station.currentLevel;
    const days = Array.from({ length: 15 }, (_, i) => `Day ${i + 1}`);

    const levels = days.map((_, i) =>
      parseFloat((baseLevel - Math.random() * 0.5 + i * 0.05).toFixed(2))
    );

    return { days, levels, station };
  }, [selectedStationId]);

  const chartData = {
    labels: forecastData.days,
    datasets: [
      {
        label: `${forecastData.station.name} - Forecast (m)`,
        data: forecastData.levels,
        borderColor: "#1a56db",
        backgroundColor: "rgba(26, 86, 219, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // allows chart to resize flexibly
    plugins: { legend: { position: "top" } },
  };

  const criticalForecast = forecastData.levels.some((l) => l < 3);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h2 className="text-2xl font-semibold mb-4">🔮 Forecasting & Early Warning</h2>
      <p className="text-gray-600 mb-4">
        15-day water level prediction with early stress alerts.
      </p>

      {/* Station selection */}
      <div className="mb-6">
        <label className="block mb-2 font-medium text-gray-700">Select Station:</label>
        <select
          value={selectedStationId}
          onChange={(e) => setSelectedStationId(e.target.value)}
          className="px-3 py-2 border rounded w-full md:w-1/2"
        >
          {mockStations.map((station) => (
            <option key={station.id} value={station.id}>
              {station.name}
            </option>
          ))}
        </select>
      </div>

      {/* Responsive grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="w-full h-80 md:h-full">
          <Line data={chartData} options={options} />
        </div>

        <div className="bg-gray-50 rounded-lg p-4 flex flex-col justify-center">
          <h3 className="font-semibold mb-2 text-dark">Forecast Summary</h3>
          <p className="text-gray-700 mb-1">
            Forecast Station: <strong>{forecastData.station.name}</strong>
          </p>
          <p className="text-gray-700 mb-1">
            Predicted Range: {Math.min(...forecastData.levels)}m - {Math.max(...forecastData.levels)}m
          </p>
          <p
            className={`font-semibold ${
              criticalForecast ? "text-red-600" : "text-green-600"
            }`}
          >
            {criticalForecast
              ? "⚠️ Likely to become critical in next 15 days"
              : "✅ No critical warning detected"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Forecasting;
