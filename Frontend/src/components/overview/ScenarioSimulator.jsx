import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import { mockStations } from "../../utils/mockData";

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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ScenarioSimulator = () => {
  // Select first station by default
  const [stationId, setStationId] = useState(mockStations[0]?.id || "");

  const station = mockStations.find((s) => s.id === stationId);

  // Get last 6 months data for chart
  const last6MonthsData = station?.data.slice(-6) || [];

  const data = {
    labels: last6MonthsData.map((d) => d.date),
    datasets: [
      {
        label: `${station?.district} Groundwater Level (m)`,
        data: last6MonthsData.map((d) => d.level),
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
      },
    ],
  };

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-semibold text-dark mb-4">Scenario Simulator</h2>
      <p className="text-gray-600 mb-4">
        Simulate groundwater levels for different stations and visualize recent trends.
      </p>

      <div className="mb-4">
        <select
          value={stationId}
          onChange={(e) => setStationId(e.target.value)}
          className="px-3 py-2 border rounded"
        >
          {mockStations.map((s) => (
            <option key={s.id} value={s.id}>
              {s.district} ({s.state})
            </option>
          ))}
        </select>
      </div>

      <Line data={data} />
    </div>
  );
};

export default ScenarioSimulator;
