import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import StationMap from "../components/maps/StationMap";
import DataCard from "../components/common/DataCard";
import WaterLevelChart from "../components/charts/WaterLevelChart";
import { mockStations, getSummaryStats } from "../utils/mockData";

const Dashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedStation, setSelectedStation] = useState(null);
  const [filters, setFilters] = useState({
    state: "all",
    status: "all",
    timeframe: "30days",
  });

  const summaryStats = getSummaryStats();

  // Professional SVG icons
  const metrics = [
    {
      title: t("total_stations"),
      value: summaryStats.total.toLocaleString(),
      subtitle: "Across India",
      icon: (
        <svg
          className="w-6 h-6"
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
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
      trend: { value: 2.3, label: "since last month" },
      gradient: "from-blue-500 to-blue-600",
    },
    {
      title: t("critical_stations"),
      value: summaryStats.critical.toLocaleString(),
      subtitle: "Needing attention",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      ),
      trend: { value: -1.2, label: "improvement" },
      gradient: "from-red-500 to-red-600",
    },
    {
      title: t("normal_stations"),
      value: summaryStats.normal.toLocaleString(),
      subtitle: "Stable conditions",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      trend: { value: 3.1, label: "since last month" },
      gradient: "from-green-500 to-green-600",
    },
    {
      title: t("avg_water_trend"),
      value: "↗ 2.3%",
      subtitle: "National average",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
      ),
      trend: { value: 2.3, label: "positive trend" },
      gradient: "from-purple-500 to-purple-600",
    },
  ];

  const states = [
    "all",
    ...new Set(mockStations.map((station) => station.state)),
  ];
  const statuses = ["all", "safe", "semi-critical", "critical"];

  // Filter stations based on current filters
  const filteredStations = useMemo(() => {
    return mockStations.filter(
      (station) =>
        (filters.state === "all" || station.state === filters.state) &&
        (filters.status === "all" || station.status === filters.status)
    );
  }, [filters.state, filters.status]);

  const handleStationSelect = (station) => {
    setSelectedStation(station);
    setTimeout(() => {
      navigate(`/station/${station.id}`);
    }, 300);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {t("dashboard")}
              </h1>
              <p className="text-gray-600">
                Real-time groundwater monitoring across India
              </p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Live Data Streaming</span>
            </div>
          </div>
        </div>

        {/* Summary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:transform hover:-translate-y-1 group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`p-3 rounded-xl bg-gradient-to-r ${metric.gradient} text-white group-hover:scale-110 transition-transform duration-300`}
                >
                  {metric.icon}
                </div>
                <div
                  className={`text-sm font-semibold ${
                    metric.trend.value > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {metric.trend.value > 0 ? "↗" : "↘"}{" "}
                  {Math.abs(metric.trend.value)}%
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {metric.value}
              </h3>
              <p className="text-gray-700 font-medium mb-1">{metric.title}</p>
              <p className="text-sm text-gray-500">{metric.subtitle}</p>
            </div>
          ))}
        </div>

        {/* Premium Filter Section */}
        <div className="relative mb-8">
          {/* Background with gradient and glass morphism */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-blue-50/80 to-purple-50/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20"></div>

          {/* Animated border */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 opacity-20 animate-pulse"></div>

          {/* Content */}
          <div className="relative p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
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
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Advanced Intelligence Filters
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Precision groundwater monitoring with AI-powered insights
                  </p>
                </div>
              </div>

              {/* Live indicator */}
              <div className="flex items-center space-x-2 bg-green-100 px-4 py-2 rounded-full border border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-700 text-sm font-medium">
                  Real-time Data
                </span>
              </div>
            </div>

            {/* Filter Controls Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* State Filter */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <svg
                    className="w-4 h-4 mr-2 text-blue-600"
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
                  State / Region
                </label>
                <div className="relative">
                  <select
                    value={filters.state}
                    onChange={(e) =>
                      handleFilterChange("state", e.target.value)
                    }
                    className="w-full appearance-none bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-2xl px-5 py-4 pr-12 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 hover:border-blue-300 hover:bg-white/90 shadow-sm hover:shadow-md"
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

              {/* Status Filter */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <svg
                    className="w-4 h-4 mr-2 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Station Status
                </label>
                <div className="relative">
                  <select
                    value={filters.status}
                    onChange={(e) =>
                      handleFilterChange("status", e.target.value)
                    }
                    className="w-full appearance-none bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-2xl px-5 py-4 pr-12 focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 hover:border-purple-300 hover:bg-white/90 shadow-sm hover:shadow-md"
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status === "all"
                          ? "📊 All Status"
                          : status === "safe"
                          ? "🟢 Safe Zones"
                          : status === "semi-critical"
                          ? "🟡 Monitor Zones"
                          : "🔴 Critical Zones"}
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

              {/* Time Period Filter */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <svg
                    className="w-4 h-4 mr-2 text-indigo-600"
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
                  Time Period
                </label>
                <div className="relative">
                  <select
                    value={filters.timeframe}
                    onChange={(e) =>
                      handleFilterChange("timeframe", e.target.value)
                    }
                    className="w-full appearance-none bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-2xl px-5 py-4 pr-12 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 hover:border-indigo-300 hover:bg-white/90 shadow-sm hover:shadow-md"
                  >
                    <option value="7days">📅 Last 7 Days</option>
                    <option value="30days">📅 Last 30 Days</option>
                    <option value="90days">📅 Last 90 Days</option>
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

              {/* Results Counter */}
              <div className="flex flex-col justify-center">
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-1">
                      {filteredStations.length}
                    </div>
                    <div className="text-blue-100 text-sm font-medium">
                      Active Stations
                    </div>
                    <div className="mt-2 flex justify-center space-x-1">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          filteredStations.length > 0
                            ? "bg-green-300 animate-pulse"
                            : "bg-gray-400"
                        }`}
                      ></div>
                      <div
                        className={`w-2 h-2 rounded-full ${
                          filteredStations.length > 0
                            ? "bg-blue-300 animate-pulse"
                            : "bg-gray-400"
                        }`}
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className={`w-2 h-2 rounded-full ${
                          filteredStations.length > 0
                            ? "bg-purple-300 animate-pulse"
                            : "bg-gray-400"
                        }`}
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Advanced Filter Options */}
            <div className="mt-6 pt-6 border-t border-gray-200/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="autoRefresh"
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <label
                      htmlFor="autoRefresh"
                      className="text-sm font-medium text-gray-700"
                    >
                      Auto-refresh every 30s
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="showTrends"
                      className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                    />
                    <label
                      htmlFor="showTrends"
                      className="text-sm font-medium text-gray-700"
                    >
                      Show trend indicators
                    </label>
                  </div>
                </div>

                <button className="px-6 py-3 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl font-semibold hover:from-gray-800 hover:to-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-2">
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
                      d="M4 6h16M4 10h16M4 14h16M4 18h16"
                    />
                  </svg>
                  <span>More Filters</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Map Section */}
          <div className="xl:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
                <h3 className="font-bold text-gray-900 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                    />
                  </svg>
                  Interactive Station Map
                </h3>
              </div>
              <div className="h-96">
                <StationMap
                  onStationSelect={handleStationSelect}
                  selectedStation={selectedStation}
                  filters={filters}
                  stations={filteredStations}
                  key={`map-${filters.state}-${filters.status}`}
                />
              </div>
            </div>
          </div>

          {/* Sidebar Section */}
          <div className="space-y-6">
            {/* System Status */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                System Overview
              </h3>
              <div className="space-y-4">
                {[
                  {
                    label: "Total Stations Monitored",
                    value: "5,260",
                    icon: "📊",
                  },
                  {
                    label: "Data Update Frequency",
                    value: "Real-time",
                    status: "success",
                  },
                  { label: "Last Data Sync", value: "Just now", icon: "🔄" },
                  {
                    label: "System Status",
                    value: "Operational",
                    status: "success",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-blue-50 transition-colors duration-200"
                  >
                    <span className="text-sm text-gray-600">{item.label}</span>
                    <span
                      className={`font-semibold ${
                        item.status === "success"
                          ? "text-green-600"
                          : "text-gray-900"
                      }`}
                    >
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl shadow-lg p-6 text-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <h3 className="font-semibold mb-3 flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                Quick Actions
              </h3>
              <p className="text-blue-100 text-sm mb-4">
                Access advanced analytics and comprehensive reports
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => navigate("/analytics")}
                  className="w-full bg-white text-blue-600 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 flex items-center justify-center"
                >
                  <svg
                    className="w-4 h-4 mr-2"
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
                  Explore Analytics
                </button>
                <button
                  onClick={() => navigate("/reports")}
                  className="w-full bg-transparent border-2 border-white text-white py-3 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-200 flex items-center justify-center"
                >
                  <svg
                    className="w-4 h-4 mr-2"
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
                  Generate Reports
                </button>
              </div>
            </div>

            {/* Selected Station Chart */}
            {selectedStation && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                    />
                  </svg>
                  Station Trend
                </h3>
                <div className="h-48">
                  <WaterLevelChart
                    data={selectedStation.data}
                    timeframe={filters.timeframe}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recent Critical Alerts */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              Recent Critical Alerts
            </h3>
            <span className="text-sm text-red-600 bg-red-50 px-3 py-1 rounded-full font-medium">
              {mockStations.filter((s) => s.status === "critical").length}{" "}
              Active
            </span>
          </div>
          <div className="space-y-3">
            {mockStations
              .filter((station) => station.status === "critical")
              .slice(0, 5)
              .map((station) => (
                <div
                  key={station.id}
                  className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-200 hover:bg-red-100 transition-all duration-200 cursor-pointer group"
                  onClick={() => handleStationSelect(station)}
                >
                  <div className="flex-1">
                    <div className="font-medium text-red-700 group-hover:text-red-800">
                      {station.name}
                    </div>
                    <div className="text-sm text-red-600">
                      {station.district}, {station.state}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-red-700">
                      {station.currentLevel}m
                    </div>
                    <div className="text-xs text-red-500">Water Level</div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
