import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import DataCard from '../../components/common/DataCard';
import { mockStations } from '../../utils/mockData';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const StationComparison = () => {
  const [selectedStations, setSelectedStations] = useState([]);

  // Colors for different station lines
  const stationColors = [
    { border: '#1a56db', bg: 'rgba(26, 86, 219, 0.1)' }, // Blue
    { border: '#0e9f6e', bg: 'rgba(14, 159, 110, 0.1)' }, // Green
    { border: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' }, // Orange
    { border: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },  // Red
    { border: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' }, // Purple
    { border: '#ec4899', bg: 'rgba(236, 72, 153, 0.1)' }  // Pink
  ];

  // Get selected station objects
  const selectedStationData = useMemo(() => {
    return mockStations.filter(station => selectedStations.includes(station.id));
  }, [selectedStations]);

  // Helper function to calculate Pearson correlation
  const calculateCorrelation = (x, y) => {
    const n = Math.min(x.length, y.length);
    const sumX = x.slice(0, n).reduce((a, b) => a + b, 0);
    const sumY = y.slice(0, n).reduce((a, b) => a + b, 0);
    const sumXY = x.slice(0, n).reduce((sum, val, idx) => sum + val * y[idx], 0);
    const sumX2 = x.slice(0, n).reduce((sum, val) => sum + val * val, 0);
    const sumY2 = y.slice(0, n).reduce((sum, val) => sum + val * val, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

    return denominator === 0 ? 0 : numerator / denominator;
  };

  // Calculate statistics for each station
  const statistics = useMemo(() => {
    if (selectedStationData.length === 0) return [];

    return selectedStationData.map(station => {
      const levels = station.data.map(d => d.level);
      const avg = levels.reduce((a, b) => a + b, 0) / levels.length;
      const min = Math.min(...levels);
      const max = Math.max(...levels);

      // Calculate standard deviation
      const variance = levels.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / levels.length;
      const stdDev = Math.sqrt(variance);

      // Calculate trend (simple linear regression)
      const n = levels.length;
      const sumX = (n * (n - 1)) / 2;
      const sumY = levels.reduce((a, b) => a + b, 0);
      const sumXY = levels.reduce((sum, val, idx) => sum + idx * val, 0);
      const sumX2 = (n * (n - 1) * (2 * n - 1)) / 6;
      const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
      const trendPerYear = slope * 365; // Convert daily trend to yearly

      return {
        id: station.id,
        name: station.name,
        district: station.district,
        currentLevel: station.currentLevel,
        average: avg,
        min,
        max,
        stdDev,
        trendPerYear,
        trend: station.trend,
        aquiferType: station.aquiferType,
        status: station.status
      };
    });
  }, [selectedStationData]);

  // Calculate correlation matrix (FIXED - no setState inside useMemo)
  const correlationMatrix = useMemo(() => {
    if (selectedStationData.length < 2) return null;

    const matrix = [];
    for (let i = 0; i < selectedStationData.length; i++) {
      matrix[i] = [];
      for (let j = 0; j < selectedStationData.length; j++) {
        if (i === j) {
          matrix[i][j] = 1.0;
        } else {
          const station1 = selectedStationData[i].data.map(d => d.level);
          const station2 = selectedStationData[j].data.map(d => d.level);
          matrix[i][j] = calculateCorrelation(station1, station2);
        }
      }
    }

    return matrix;
  }, [selectedStationData]);

  // Generate AI insights
  const aiInsights = useMemo(() => {
    if (statistics.length < 2) return null;

    const insights = [];

    // Find fastest declining station
    const mostDeclining = statistics.reduce((prev, curr) =>
      curr.trendPerYear < prev.trendPerYear ? curr : prev
    );
    const leastDeclining = statistics.reduce((prev, curr) =>
      curr.trendPerYear > prev.trendPerYear ? curr : prev
    );

    if (mostDeclining.trendPerYear < -1 && Math.abs(mostDeclining.trendPerYear - leastDeclining.trendPerYear) > 2) {
      insights.push({
        type: 'warning',
        title: 'Divergent Decline Rates Detected',
        message: `${mostDeclining.name} shows ${Math.abs(mostDeclining.trendPerYear / (leastDeclining.trendPerYear || 1)).toFixed(1)}x faster decline than ${leastDeclining.name}. Possible causes: Higher extraction rates, lower recharge efficiency.`,
        recommendation: 'Investigate extraction patterns and consider implementing managed aquifer recharge.'
      });
    }

    // Check for high correlation
    if (correlationMatrix && correlationMatrix.length > 1) {
      const highCorrelations = [];
      for (let i = 0; i < correlationMatrix.length; i++) {
        for (let j = i + 1; j < correlationMatrix.length; j++) {
          if (correlationMatrix[i][j] > 0.85) {
            highCorrelations.push({
              station1: statistics[i].name,
              station2: statistics[j].name,
              correlation: correlationMatrix[i][j]
            });
          }
        }
      }

      if (highCorrelations.length > 0) {
        insights.push({
          type: 'info',
          title: 'Strong Hydraulic Connectivity',
          message: `High correlation (${highCorrelations[0].correlation.toFixed(2)}) between ${highCorrelations[0].station1} and ${highCorrelations[0].station2} suggests strong aquifer connectivity.`,
          recommendation: 'These stations may be drawing from the same aquifer system. Coordinate management strategies.'
        });
      }
    }

    // Check for critical stations
    const criticalStations = statistics.filter(s => s.status === 'critical');
    if (criticalStations.length > 0) {
      insights.push({
        type: 'alert',
        title: 'Critical Water Levels Detected',
        message: `${criticalStations.length} station(s) currently at critical levels: ${criticalStations.map(s => s.name).join(', ')}.`,
        recommendation: 'Immediate intervention required. Consider temporary extraction restrictions and emergency recharge measures.'
      });
    }

    return insights.length > 0 ? insights : null;
  }, [statistics, correlationMatrix]);

  // Prepare chart data
  const chartData = useMemo(() => {
    if (selectedStationData.length === 0) return null;

    // Use the first station's dates as x-axis labels
    const labels = selectedStationData[0].data.map(item => {
      const date = new Date(item.date);
      return `${date.getDate()}/${date.getMonth() + 1}`;
    });

    const datasets = selectedStationData.map((station, index) => ({
      label: station.name,
      data: station.data.map(item => item.level),
      borderColor: stationColors[index].border,
      backgroundColor: stationColors[index].bg,
      fill: false,
      tension: 0.4,
      pointBackgroundColor: stationColors[index].border,
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2,
      pointRadius: 3,
      pointHoverRadius: 5
    }));

    return { labels, datasets };
  }, [selectedStationData]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Water Level Comparison',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1f2937',
        bodyColor: '#1f2937',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          maxTicksLimit: 15,
        }
      },
      y: {
        title: {
          display: true,
          text: 'Water Level (m)',
          font: {
            size: 14,
            weight: 'bold'
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        }
      }
    }
  };

  // Handle station selection
  const handleStationToggle = (stationId) => {
    setSelectedStations(prev => {
      if (prev.includes(stationId)) {
        return prev.filter(id => id !== stationId);
      } else if (prev.length < 6) {
        return [...prev, stationId];
      }
      return prev;
    });
  };

  const handleClearSelection = () => {
    setSelectedStations([]);
  };

  // Export functions
  const handleExportChart = () => {
    alert('Chart export functionality will download PNG/SVG in production');
  };

  const handleExportCSV = () => {
    if (statistics.length === 0) return;

    let csv = 'Metric,' + statistics.map(s => s.name).join(',') + '\n';
    csv += 'Average Depth (m),' + statistics.map(s => s.average.toFixed(2)).join(',') + '\n';
    csv += 'Current Level (m),' + statistics.map(s => s.currentLevel.toFixed(2)).join(',') + '\n';
    csv += 'Trend (m/year),' + statistics.map(s => s.trendPerYear.toFixed(2)).join(',') + '\n';
    csv += 'Std Deviation,' + statistics.map(s => s.stdDev.toFixed(2)).join(',') + '\n';
    csv += 'Min Level (m),' + statistics.map(s => s.min.toFixed(2)).join(',') + '\n';
    csv += 'Max Level (m),' + statistics.map(s => s.max.toFixed(2)).join(',') + '\n';
    csv += 'Aquifer Type,' + statistics.map(s => s.aquiferType).join(',') + '\n';
    csv += 'Status,' + statistics.map(s => s.status).join(',') + '\n';

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `station_comparison_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const handleGenerateReport = () => {
    alert('PDF report generation will be implemented in production');
  };

  const handleCopyCitation = () => {
    const ids = selectedStationData.map(s => s.id).join(', ');
    const citation = `Data from CGWB DWLR stations [${ids}] (2024). SeeJal Groundwater Monitoring Platform.`;
    navigator.clipboard.writeText(citation);
    alert('Citation copied to clipboard!');
  };

  const getStatusBadge = (status) => {
    const badges = {
      safe: 'bg-green-100 text-green-800 border-green-200',
      'semi-critical': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      critical: 'bg-red-100 text-red-800 border-red-200'
    };
    return badges[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getTrendIcon = (trend) => {
    if (trend > 0.5) return '↗';
    if (trend < -0.5) return '↘';
    return '→';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/researchers" className="text-primary hover:text-blue-700 text-sm font-medium mb-4 inline-flex items-center transition-colors">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Researcher Hub
          </Link>
          <div className="flex items-center gap-3 mb-3">
            <div className="text-4xl">📊</div>
            <h1 className="text-4xl font-bold text-gray-900">Station Comparison Lab</h1>
          </div>
          <p className="text-lg text-gray-600">Compare water levels and analyze trends across multiple monitoring stations</p>
        </div>

        {/* Quick Stats */}
        {selectedStations.length >= 2 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <DataCard
              title="Stations Selected"
              value={selectedStations.length}
              subtitle="In comparison"
              icon="📍"
              className="hover:shadow-xl transition-shadow"
            />
            <DataCard
              title="Avg. Water Level"
              value={`${(statistics.reduce((sum, s) => sum + s.average, 0) / statistics.length).toFixed(1)}m`}
              subtitle="Across selection"
              icon="💧"
              className="hover:shadow-xl transition-shadow"
            />
            <DataCard
              title="Trend Range"
              value={`${Math.min(...statistics.map(s => s.trendPerYear)).toFixed(1)} to ${Math.max(...statistics.map(s => s.trendPerYear)).toFixed(1)}`}
              subtitle="m/year variation"
              icon="📈"
              className="hover:shadow-xl transition-shadow"
            />
            <DataCard
              title="Correlation"
              value={correlationMatrix && correlationMatrix.length >= 2 ? `${(correlationMatrix[0][1] || 0).toFixed(2)}` : 'N/A'}
              subtitle={correlationMatrix && correlationMatrix[0][1] > 0.7 ? 'Strong' : 'Calculating...'}
              icon="🔗"
              trend={correlationMatrix && correlationMatrix[0][1] > 0.7 ? { value: 1, label: 'High' } : null}
              className="hover:shadow-xl transition-shadow"
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Station Selection Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sticky top-8">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Select Stations</h3>
                  <p className="text-sm text-gray-500">Choose 2-6 to compare</p>
                </div>
                {selectedStations.length > 0 && (
                  <button
                    onClick={handleClearSelection}
                    className="text-xs text-red-600 hover:text-red-700 font-medium px-3 py-1 rounded-lg border border-red-200 hover:bg-red-50 transition-all"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Selected Count Badge */}
              <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-900">Selected:</span>
                  <span className="text-xl font-bold text-blue-600">{selectedStations.length}/6</span>
                </div>
                {selectedStations.length > 0 && selectedStations.length < 2 && (
                  <p className="text-xs text-blue-700 mt-1">⚠ Need at least 2 stations</p>
                )}
              </div>

              {/* Station List */}
              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
                {mockStations.map(station => {
                  const isSelected = selectedStations.includes(station.id);
                  const isDisabled = selectedStations.length >= 6 && !isSelected;

                  return (
                    <label
                      key={station.id}
                      className={`block p-3 border-2 rounded-xl cursor-pointer transition-all ${
                        isSelected
                          ? 'border-primary bg-blue-50 shadow-md'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                      } ${isDisabled ? 'opacity-40 cursor-not-allowed' : ''}`}
                    >
                      <div className="flex items-start">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleStationToggle(station.id)}
                          disabled={isDisabled}
                          className="mt-1 h-4 w-4 text-primary focus:ring-primary rounded border-gray-300"
                        />
                        <div className="ml-3 flex-1">
                          <div className="text-sm font-semibold text-gray-900">{station.name}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{station.district}, {station.state}</div>
                          <div className="flex items-center gap-2 mt-2">
                            <span className={`text-xs px-2 py-0.5 rounded-full border ${getStatusBadge(station.status)}`}>
                              {station.status}
                            </span>
                            <span className="text-xs text-gray-600">{station.currentLevel.toFixed(1)}m</span>
                          </div>
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2">
            {/* Empty State */}
            {selectedStations.length === 0 && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
                <div className="text-7xl mb-6">📊</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Ready to Compare Stations</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Select 2-6 stations from the sidebar to begin your comparison analysis
                </p>
                <div className="inline-block bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6 text-left">
                  <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                    <span className="text-xl mr-2">✨</span>
                    You'll Get:
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2 text-lg">✓</span>
                      Side-by-side water level trends
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2 text-lg">✓</span>
                      Statistical analysis & correlation
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2 text-lg">✓</span>
                      AI-powered insights
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2 text-lg">✓</span>
                      Export tools & citations
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* Warning State */}
            {selectedStations.length === 1 && (
              <div className="bg-white rounded-2xl shadow-lg border border-yellow-300 p-12 text-center">
                <div className="text-6xl mb-4">⚠️</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Almost There!</h3>
                <p className="text-gray-600 mb-4">
                  You've selected 1 station. Please select at least 1 more to enable comparison.
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <span className="text-2xl font-bold text-yellow-600">{selectedStations.length}</span>
                  <span className="text-gray-600">/</span>
                  <span className="text-gray-400">2 minimum</span>
                </div>
              </div>
            )}

            {/* Comparison Results */}
            {selectedStations.length >= 2 && (
              <div className="space-y-8">
                {/* Comparison Chart */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Water Level Trends</h3>
                    <button
                      onClick={handleExportChart}
                      className="text-primary hover:text-blue-700 text-sm font-medium flex items-center gap-2 px-4 py-2 rounded-lg border border-blue-200 hover:bg-blue-50 transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Export
                    </button>
                  </div>
                  <div className="h-96">
                    {chartData && <Line data={chartData} options={chartOptions} />}
                  </div>
                </div>

                {/* Statistical Comparison Table */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Statistical Analysis</h3>
                    <button
                      onClick={handleExportCSV}
                      className="text-primary hover:text-blue-700 text-sm font-medium flex items-center gap-2 px-4 py-2 rounded-lg border border-blue-200 hover:bg-blue-50 transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      CSV
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b-2 border-gray-200 bg-gray-50">
                          <th className="text-left py-3 px-4 font-bold text-gray-700">Metric</th>
                          {statistics.map((stat, idx) => (
                            <th key={stat.id} className="text-right py-3 px-4 font-bold" style={{ color: stationColors[idx].border }}>
                              {stat.name.length > 20 ? stat.name.substring(0, 20) + '...' : stat.name}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-4 font-semibold text-gray-700">District</td>
                          {statistics.map(stat => (
                            <td key={stat.id} className="text-right py-3 px-4 text-gray-600">{stat.district}</td>
                          ))}
                        </tr>
                        <tr className="border-b hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-4 font-semibold text-gray-700">Current Level (m)</td>
                          {statistics.map(stat => (
                            <td key={stat.id} className="text-right py-3 px-4 font-bold text-gray-900">{stat.currentLevel.toFixed(2)}</td>
                          ))}
                        </tr>
                        <tr className="border-b hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-4 font-semibold text-gray-700">Average Depth (m)</td>
                          {statistics.map(stat => (
                            <td key={stat.id} className="text-right py-3 px-4 text-gray-600">{stat.average.toFixed(2)}</td>
                          ))}
                        </tr>
                        <tr className="border-b hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-4 font-semibold text-gray-700">Trend (m/year)</td>
                          {statistics.map(stat => (
                            <td key={stat.id} className="text-right py-3 px-4">
                              <span className={`font-semibold ${stat.trendPerYear > 0 ? 'text-green-600' : stat.trendPerYear < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                                {getTrendIcon(stat.trendPerYear)} {stat.trendPerYear.toFixed(2)}
                              </span>
                            </td>
                          ))}
                        </tr>
                        <tr className="border-b hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-4 font-semibold text-gray-700">Std Deviation</td>
                          {statistics.map(stat => (
                            <td key={stat.id} className="text-right py-3 px-4 text-gray-600">{stat.stdDev.toFixed(2)}</td>
                          ))}
                        </tr>
                        <tr className="border-b hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-4 font-semibold text-gray-700">Min / Max (m)</td>
                          {statistics.map(stat => (
                            <td key={stat.id} className="text-right py-3 px-4 text-gray-600">
                              {stat.min.toFixed(1)} / {stat.max.toFixed(1)}
                            </td>
                          ))}
                        </tr>
                        <tr className="border-b hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-4 font-semibold text-gray-700">Aquifer Type</td>
                          {statistics.map(stat => (
                            <td key={stat.id} className="text-right py-3 px-4 text-gray-600">{stat.aquiferType}</td>
                          ))}
                        </tr>
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-4 font-semibold text-gray-700">Status</td>
                          {statistics.map(stat => (
                            <td key={stat.id} className="text-right py-3 px-4">
                              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadge(stat.status)}`}>
                                {stat.status}
                              </span>
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Correlation Matrix */}
                {correlationMatrix && selectedStations.length >= 3 && (
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Correlation Matrix</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr>
                            <th className="text-left py-2 px-4"></th>
                            {statistics.map((stat, idx) => (
                              <th key={stat.id} className="text-center py-2 px-4 font-bold" style={{ color: stationColors[idx].border }}>
                                {stat.name.split(' ')[0]}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {statistics.map((stat, i) => (
                            <tr key={stat.id} className="border-t">
                              <td className="py-2 px-4 font-bold" style={{ color: stationColors[i].border }}>
                                {stat.name.split(' ')[0]}
                              </td>
                              {correlationMatrix[i].map((corr, j) => (
                                <td key={j} className="text-center py-2 px-4">
                                  <span className={`inline-block px-3 py-1 rounded-lg font-semibold ${
                                    corr === 1 ? 'bg-gray-100 text-gray-600' :
                                    corr > 0.7 ? 'bg-green-100 text-green-800 border border-green-300' :
                                    corr > 0.4 ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' :
                                    'bg-red-100 text-red-800 border border-red-300'
                                  }`}>
                                    {corr.toFixed(2)}
                                  </span>
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div className="mt-4 flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
                          <span className="text-gray-600">Strong (&gt; 0.7)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded"></div>
                          <span className="text-gray-600">Moderate (0.4-0.7)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
                          <span className="text-gray-600">Weak (&lt; 0.4)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* AI Insights */}
                {aiInsights && (
                  <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl shadow-lg border border-purple-200 p-6">
                    <div className="flex items-center mb-4">
                      <span className="text-3xl mr-3">🤖</span>
                      <h3 className="text-xl font-bold text-gray-900">AI-Powered Insights</h3>
                    </div>
                    <div className="space-y-4">
                      {aiInsights.map((insight, idx) => (
                        <div
                          key={idx}
                          className={`p-4 rounded-xl border-l-4 ${
                            insight.type === 'alert' ? 'bg-red-50 border-red-500 shadow-md' :
                            insight.type === 'warning' ? 'bg-yellow-50 border-yellow-500 shadow-md' :
                            'bg-blue-50 border-blue-500 shadow-md'
                          }`}
                        >
                          <h4 className="font-bold text-gray-900 mb-2">{insight.title}</h4>
                          <p className="text-sm text-gray-700 mb-3">{insight.message}</p>
                          <div className="flex items-start p-3 bg-white rounded-lg border border-gray-200">
                            <span className="font-semibold text-gray-700 mr-2 text-sm">💡 Recommendation:</span>
                            <span className="text-gray-600 text-sm">{insight.recommendation}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Export Options */}
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl p-6 border border-gray-700">
                  <h3 className="text-xl font-bold mb-4 text-white">Export & Citation Tools</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button
                      onClick={handleExportChart}
                      className="bg-white hover:bg-gray-100 rounded-xl p-4 transition-all text-left transform hover:scale-105 border border-gray-200 shadow-md"
                    >
                      <div className="text-3xl mb-2">📊</div>
                      <div className="font-semibold text-sm text-gray-900">Export Chart</div>
                      <div className="text-xs text-gray-600">PNG/SVG</div>
                    </button>
                    <button
                      onClick={handleExportCSV}
                      className="bg-white hover:bg-gray-100 rounded-xl p-4 transition-all text-left transform hover:scale-105 border border-gray-200 shadow-md"
                    >
                      <div className="text-3xl mb-2">📄</div>
                      <div className="font-semibold text-sm text-gray-900">Export Data</div>
                      <div className="text-xs text-gray-600">CSV</div>
                    </button>
                    <button
                      onClick={handleGenerateReport}
                      className="bg-white hover:bg-gray-100 rounded-xl p-4 transition-all text-left transform hover:scale-105 border border-gray-200 shadow-md"
                    >
                      <div className="text-3xl mb-2">📋</div>
                      <div className="font-semibold text-sm text-gray-900">Report</div>
                      <div className="text-xs text-gray-600">PDF</div>
                    </button>
                    <button
                      onClick={handleCopyCitation}
                      className="bg-white hover:bg-gray-100 rounded-xl p-4 transition-all text-left transform hover:scale-105 border border-gray-200 shadow-md"
                    >
                      <div className="text-3xl mb-2">📖</div>
                      <div className="font-semibold text-sm text-gray-900">Citation</div>
                      <div className="text-xs text-gray-600">Copy</div>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StationComparison;
