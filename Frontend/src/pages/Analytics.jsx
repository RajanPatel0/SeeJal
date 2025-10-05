import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { mockStations } from "../utils/mockData";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Analytics = () => {
  const { t } = useTranslation();
  const [selectedState, setSelectedState] = useState("all");
  const [timeRange, setTimeRange] = useState("30days");
  const [isLoading, setIsLoading] = useState(false);

  const states = [
    "all",
    ...new Set(mockStations.map((station) => station.state)),
  ];

  // Generate time-based data
  const generateTimeBasedData = (baseData, timeRange) => {
    const now = new Date();
    const multipliers = {
      "7days": 0.95,
      "30days": 1.0,
      "90days": 1.05,
      "1year": 1.1,
    };

    return baseData.map((station) => ({
      ...station,
      currentLevel: station.currentLevel * multipliers[timeRange],
      data: station.data.map((point, index) => ({
        ...point,
        level:
          point.level *
          multipliers[timeRange] *
          (1 + Math.sin(index / 10) * 0.1),
      })),
    }));
  };

  // Filter stations based on selection
  const filteredStations = useMemo(() => {
    let filtered = mockStations;

    if (selectedState !== "all") {
      filtered = filtered.filter((station) => station.state === selectedState);
    }

    return generateTimeBasedData(filtered, timeRange);
  }, [selectedState, timeRange]);

  // State-wise analysis with dynamic data
  const stateAnalysis = useMemo(() => {
    const analysis = {};

    filteredStations.forEach((station) => {
      if (!analysis[station.state]) {
        analysis[station.state] = {
          total: 0,
          critical: 0,
          safe: 0,
          semiCritical: 0,
          avgLevel: 0,
          levels: [],
          trend: Math.random() > 0.5 ? "increasing" : "decreasing",
        };
      }

      analysis[station.state].total++;
      analysis[station.state].levels.push(station.currentLevel);

      if (station.status === "critical") analysis[station.state].critical++;
      if (station.status === "safe") analysis[station.state].safe++;
      if (station.status === "semi-critical")
        analysis[station.state].semiCritical++;
    });

    // Calculate averages
    Object.keys(analysis).forEach((state) => {
      analysis[state].avgLevel =
        analysis[state].levels.reduce((a, b) => a + b, 0) /
        analysis[state].levels.length;
    });

    return analysis;
  }, [filteredStations]);

  // Handle filter changes with loading state
  const handleFilterChange = (type, value) => {
    setIsLoading(true);
    setTimeout(() => {
      if (type === "state") {
        setSelectedState(value);
      } else {
        setTimeRange(value);
      }
      setIsLoading(false);
    }, 300);
  };

  const stateWiseData = {
    labels: Object.keys(stateAnalysis),
    datasets: [
      {
        label: "Safe Stations",
        data: Object.values(stateAnalysis).map((state) => state.safe),
        backgroundColor: "#0e9f6e",
      },
      {
        label: "Critical Stations",
        data: Object.values(stateAnalysis).map((state) => state.critical),
        backgroundColor: "#f05252",
      },
    ],
  };

  const levelTrendData = {
    labels: Object.keys(stateAnalysis),
    datasets: [
      {
        label: "Average Water Level (m)",
        data: Object.values(stateAnalysis).map((state) => state.avgLevel),
        borderColor: "#1a56db",
        backgroundColor: "rgba(26, 86, 219, 0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-dark mb-2">
            {t("analytics")}
          </h1>
          <p className="text-gray-600">
            Advanced analytics and comparative analysis
          </p>
        </div>

        {/* Premium Analytics Filter Section */}
        <div className="relative mb-8">
          {/* Background with gradient and glass morphism */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-emerald-50/80 to-teal-50/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20"></div>

          {/* Animated border */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 opacity-20 animate-pulse"></div>

          {/* Content */}
          <div className="relative p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Advanced Analytics Filters
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Deep insights and comparative analysis across regions
                  </p>
                </div>
              </div>

              {/* Live indicator */}
              <div className="flex items-center space-x-2 bg-emerald-100 px-4 py-2 rounded-full border border-emerald-200">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-emerald-700 text-sm font-medium">
                  AI-Powered
                </span>
              </div>
            </div>

            {/* Filter Controls Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* State Filter */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <svg
                    className="w-4 h-4 mr-2 text-emerald-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                  </svg>
                  State / Region Analysis
                </label>
                <div className="relative">
                  <select
                    value={selectedState}
                    onChange={(e) =>
                      handleFilterChange("state", e.target.value)
                    }
                    className="w-full appearance-none bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-2xl px-5 py-4 pr-12 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 hover:border-emerald-300 hover:bg-white/90 shadow-sm hover:shadow-md"
                  >
                    {states.map((state) => (
                      <option key={state} value={state}>
                        {state === "all" ? "🌍 All States" : `🏛️ ${state}`}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Time Range Filter */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <svg
                    className="w-4 h-4 mr-2 text-cyan-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Analysis Time Period
                </label>
                <div className="relative">
                  <select
                    value={timeRange}
                    onChange={(e) =>
                      handleFilterChange("timeRange", e.target.value)
                    }
                    className="w-full appearance-none bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-2xl px-5 py-4 pr-12 focus:outline-none focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all duration-300 hover:border-cyan-300 hover:bg-white/90 shadow-sm hover:shadow-md"
                  >
                    <option value="7days">📅 Last 7 Days</option>
                    <option value="30days">📅 Last 30 Days</option>
                    <option value="90days">📅 Last 90 Days</option>
                    <option value="1year">📅 Last Year</option>
                  </select>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Advanced Analytics Options */}
            <div className="mt-6 pt-6 border-t border-gray-200/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="enableAI"
                      className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                    />
                    <label
                      htmlFor="enableAI"
                      className="text-sm font-medium text-gray-700"
                    >
                      Enable AI predictions
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="compareTrends"
                      className="w-4 h-4 text-cyan-600 rounded focus:ring-cyan-500"
                    />
                    <label
                      htmlFor="compareTrends"
                      className="text-sm font-medium text-gray-700"
                    >
                      Compare with historical data
                    </label>
                  </div>
                </div>

                <button className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span>Export Analysis</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* State-wise Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-dark mb-4">
              State-wise Station Distribution
            </h3>
            <div className="h-80">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Updating chart data...</p>
                  </div>
                </div>
              ) : (
                <Bar data={stateWiseData} options={chartOptions} />
              )}
            </div>
          </div>

          {/* Average Water Levels */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-dark mb-4">
              Average Water Levels by State
            </h3>
            <div className="h-80">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Processing analysis...</p>
                  </div>
                </div>
              ) : (
                <Line data={levelTrendData} options={chartOptions} />
              )}
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-3xl font-bold text-primary mb-2">
              {filteredStations.filter((s) => s.status === "critical").length}
            </div>
            <div className="text-gray-600">Critical Stations</div>
            <div className="text-sm text-red-600 mt-1">
              Requires Immediate Attention
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-3xl font-bold text-secondary mb-2">
              {filteredStations.length > 0
                ? (
                    filteredStations.reduce(
                      (sum, station) => sum + station.currentLevel,
                      0
                    ) / filteredStations.length
                  ).toFixed(1)
                : "0.0"}
              m
            </div>
            <div className="text-gray-600">
              {selectedState === "all" ? "National" : selectedState} Average
              Level
            </div>
            <div className="text-sm text-green-600 mt-1">
              Within Safe Limits
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-3xl font-bold text-accent mb-2">
              {filteredStations.length > 0
                ? Math.max(
                    ...filteredStations.map((s) => s.currentLevel)
                  ).toFixed(1)
                : "0.0"}
              m
            </div>
            <div className="text-gray-600">Deepest Water Level</div>
            <div className="text-sm text-orange-600 mt-1">
              {selectedState === "all" ? "National" : selectedState} Region
            </div>
          </div>
        </div>

        {/* Regional Comparison */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="font-semibold text-dark mb-4">Regional Comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 font-medium">State</th>
                  <th className="text-right py-3 font-medium">
                    Total Stations
                  </th>
                  <th className="text-right py-3 font-medium">Critical</th>
                  <th className="text-right py-3 font-medium">Safe</th>
                  <th className="text-right py-3 font-medium">
                    Avg. Level (m)
                  </th>
                  <th className="text-right py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(stateAnalysis).map(([state, data]) => (
                  <tr key={state} className="border-b hover:bg-gray-50">
                    <td className="py-3 font-medium">{state}</td>
                    <td className="text-right py-3">{data.total}</td>
                    <td className="text-right py-3 text-red-600">
                      {data.critical}
                    </td>
                    <td className="text-right py-3 text-green-600">
                      {data.safe}
                    </td>
                    <td className="text-right py-3">
                      {data.avgLevel.toFixed(1)}
                    </td>
                    <td className="text-right py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          data.critical / data.total > 0.3
                            ? "bg-red-100 text-red-800"
                            : data.critical / data.total > 0.1
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {data.critical / data.total > 0.3
                          ? "Critical"
                          : data.critical / data.total > 0.1
                          ? "Watch"
                          : "Good"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
