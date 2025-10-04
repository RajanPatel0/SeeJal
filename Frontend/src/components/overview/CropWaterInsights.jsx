import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import { mockStations } from "../../utils/mockData";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const CropWaterInsights = () => {
  // Select first 5 stations by default
  const [selectedStations, setSelectedStations] = useState(mockStations.slice(0, 5));

  const data = {
    labels: selectedStations.map((s) => s.district),
    datasets: [
      {
        label: "Current Groundwater Level (m)",
        data: selectedStations.map((s) => s.currentLevel),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  };

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-semibold text-dark mb-4">Crop Water Insights</h2>
      <p className="text-gray-600 mb-4">
        Visualize water availability in different districts to support crop planning and irrigation optimization.
      </p>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Select Districts:</label>
        <select
          multiple
          value={selectedStations.map((s) => s.id)}
          onChange={(e) => {
            const selectedIds = Array.from(e.target.selectedOptions, (option) => option.value);
            setSelectedStations(
              mockStations.filter((s) => selectedIds.includes(s.id)).slice(0, 5)
            );
          }}
          className="px-3 py-2 border rounded w-full"
        >
          {mockStations.map((s) => (
            <option key={s.id} value={s.id}>
              {s.district} ({s.state})
            </option>
          ))}
        </select>
        <p className="text-gray-500 text-sm mt-1">Hold Ctrl (Cmd on Mac) to select multiple districts</p>
      </div>

      <Bar data={data} />
    </div>
  );
};

export default CropWaterInsights;
