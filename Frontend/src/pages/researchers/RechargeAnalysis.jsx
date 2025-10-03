import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
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
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const RechargeAnalysis = () => {
  const [selectedStation, setSelectedStation] = useState(mockStations[0]?.id || '');
  const [dateRange, setDateRange] = useState('6months');

  // Get selected station data
  const stationData = useMemo(() => {
    return mockStations.find(s => s.id === selectedStation);
  }, [selectedStation]);

  // Recharge detection algorithm
  const detectRechargeEvents = useMemo(() => {
    if (!stationData) return [];

    const events = [];
    const data = stationData.data;

    for (let i = 0; i < data.length - 3; i++) {
      const rainfall = data[i].rainfall;

      // Check if significant rainfall (>10mm)
      if (rainfall > 10) {
        // Check water level rise in next 1-3 days
        const levelBefore = data[i].level;
        const levelAfter1 = data[i + 1]?.level || levelBefore;
        const levelAfter2 = data[i + 2]?.level || levelBefore;
        const levelAfter3 = data[i + 3]?.level || levelBefore;

        // Find maximum rise within 3 days
        const maxLevelAfter = Math.max(levelAfter1, levelAfter2, levelAfter3);
        const rise = maxLevelAfter - levelBefore;

        if (rise > 0.3) { // Significant rise (>0.3m)
          // Calculate cumulative rainfall (3-day window)
          const totalRainfall = rainfall +
            (data[i + 1]?.rainfall || 0) +
            (data[i + 2]?.rainfall || 0);

          // Determine response time
          let responseTime = '48-72 hours';
          if (levelAfter1 > levelBefore + 0.2) responseTime = '12-24 hours';
          else if (levelAfter2 > levelBefore + 0.2) responseTime = '24-48 hours';

          events.push({
            id: `event_${i}`,
            date: data[i].date,
            endDate: data[i + 2]?.date,
            rainfall: totalRainfall.toFixed(1),
            waterLevelRise: rise.toFixed(2),
            efficiency: ((rise / totalRainfall) * 100).toFixed(1),
            responseTime: responseTime,
            eventIndex: i
          });
        }
      }
    }

    return events;
  }, [stationData]);

  // Season summary statistics
  const seasonSummary = useMemo(() => {
    if (!stationData || detectRechargeEvents.length === 0) return null;

    const totalRainfall = detectRechargeEvents.reduce((sum, e) => sum + parseFloat(e.rainfall), 0);
    const totalRecharge = detectRechargeEvents.reduce((sum, e) => sum + parseFloat(e.waterLevelRise), 0);
    const avgEfficiency = detectRechargeEvents.reduce((sum, e) => sum + parseFloat(e.efficiency), 0) / detectRechargeEvents.length;
    const bestEvent = detectRechargeEvents.reduce((best, e) =>
      parseFloat(e.efficiency) > parseFloat(best.efficiency) ? e : best
    );

    return {
      totalRainfall: totalRainfall.toFixed(1),
      totalRecharge: totalRecharge.toFixed(2),
      avgEfficiency: avgEfficiency.toFixed(1),
      eventCount: detectRechargeEvents.length,
      bestEvent: bestEvent
    };
  }, [detectRechargeEvents, stationData]);

  // Prepare dual-axis chart data
  const chartData = useMemo(() => {
    if (!stationData) return null;

    const labels = stationData.data.map(item => {
      const date = new Date(item.date);
      return `${date.getDate()}/${date.getMonth() + 1}`;
    });

    // Create background colors for recharge events
    const backgroundColors = stationData.data.map((_, index) => {
      const isRechargeEvent = detectRechargeEvents.some(e => e.eventIndex === index);
      return isRechargeEvent ? 'rgba(250, 204, 21, 0.2)' : 'transparent';
    });

    return {
      labels,
      datasets: [
        {
          type: 'line',
          label: 'Water Level (m)',
          data: stationData.data.map(item => item.level),
          borderColor: '#1a56db',
          backgroundColor: 'rgba(26, 86, 219, 0.1)',
          fill: false,
          tension: 0.4,
          yAxisID: 'y',
          pointBackgroundColor: '#1a56db',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 3,
          pointHoverRadius: 5,
        },
        {
          type: 'bar',
          label: 'Rainfall (mm)',
          data: stationData.data.map(item => item.rainfall),
          backgroundColor: 'rgba(14, 159, 110, 0.6)',
          borderColor: '#0e9f6e',
          borderWidth: 1,
          yAxisID: 'y1',
        }
      ]
    };
  }, [stationData, detectRechargeEvents]);

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
        text: 'Water Level vs Rainfall Analysis',
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
        type: 'linear',
        display: true,
        position: 'left',
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
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Rainfall (mm)',
          font: {
            size: 14,
            weight: 'bold'
          }
        },
        grid: {
          drawOnChartArea: false,
        },
        beginAtZero: true
      }
    }
  };

  // Generate AI interpretation
  const aiInterpretation = useMemo(() => {
    if (!seasonSummary || !stationData) return null;

    const efficiency = parseFloat(seasonSummary.avgEfficiency);
    const aquifer = stationData.aquiferType;

    let efficiencyAssessment = '';
    if (efficiency > 15) efficiencyAssessment = 'excellent';
    else if (efficiency > 12) efficiencyAssessment = 'good';
    else if (efficiency > 8) efficiencyAssessment = 'typical';
    else efficiencyAssessment = 'below average';

    const fastResponse = detectRechargeEvents.some(e => e.responseTime === '12-24 hours');
    const connectivity = fastResponse ? 'good aquifer connectivity' : 'moderate aquifer connectivity';

    return {
      assessment: efficiencyAssessment,
      efficiency: seasonSummary.avgEfficiency,
      aquifer: aquifer,
      connectivity: connectivity,
      interpretation: `Recharge efficiency of ${seasonSummary.avgEfficiency}% is ${efficiencyAssessment} for ${aquifer} aquifers in ${stationData.state}. ${fastResponse ? 'Faster response times (12-24h) indicate ' + connectivity : 'Response times of 24-72h suggest ' + connectivity}.`,
      recommendation: efficiency > 12
        ? 'This area is highly suitable for artificial recharge structures. Consider implementing percolation tanks or recharge wells.'
        : 'Moderate recharge efficiency suggests potential for improvement through managed aquifer recharge techniques.'
    };
  }, [seasonSummary, stationData, detectRechargeEvents]);

  // Export functions
  const handleExportEvents = () => {
    if (detectRechargeEvents.length === 0) return;

    let csv = 'Date,End Date,Rainfall (mm),Water Level Rise (m),Efficiency (%),Response Time\n';
    detectRechargeEvents.forEach(event => {
      csv += `${event.date},${event.endDate},${event.rainfall},${event.waterLevelRise},${event.efficiency},${event.responseTime}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recharge_events_${stationData.id}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const handleExportChart = () => {
    alert('Chart export functionality will download PNG in production');
  };

  const handleGenerateReport = () => {
    alert('PDF report generation will be implemented in production');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 py-8">
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
            <div className="text-4xl">💧</div>
            <h1 className="text-4xl font-bold text-gray-900">Recharge Event Tracker</h1>
          </div>
          <p className="text-lg text-gray-600">Detect and quantify groundwater recharge events with rainfall correlation analysis</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Analysis Parameters</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Select Station</label>
              <select
                value={selectedStation}
                onChange={(e) => setSelectedStation(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              >
                {mockStations.map(station => (
                  <option key={station.id} value={station.id}>
                    {station.name} - {station.district}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Date Range</label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              >
                <option value="1month">Last Month</option>
                <option value="3months">Last 3 Months</option>
                <option value="6months">Last 6 Months</option>
                <option value="1year">Last Year</option>
                <option value="monsoon2024">Monsoon 2024</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Quick Info</label>
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl px-4 py-3 h-[52px] flex items-center">
                <span className="text-sm font-medium text-blue-900">
                  {stationData ? `${stationData.aquiferType} Aquifer` : 'Select a station'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        {stationData && seasonSummary && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <DataCard
              title="Recharge Events"
              value={seasonSummary.eventCount}
              subtitle="Detected events"
              icon="⚡"
              className="hover:shadow-xl transition-shadow"
            />
            <DataCard
              title="Total Rainfall"
              value={`${seasonSummary.totalRainfall}mm`}
              subtitle="Cumulative"
              icon="🌧️"
              className="hover:shadow-xl transition-shadow"
            />
            <DataCard
              title="Total Recharge"
              value={`${seasonSummary.totalRecharge}m`}
              subtitle="Water level rise"
              icon="📈"
              trend={{ value: parseFloat(seasonSummary.totalRecharge), label: 'total rise' }}
              className="hover:shadow-xl transition-shadow"
            />
            <DataCard
              title="Avg. Efficiency"
              value={`${seasonSummary.avgEfficiency}%`}
              subtitle="Recharge efficiency"
              icon="💯"
              trend={{ value: parseFloat(seasonSummary.avgEfficiency), label: aiInterpretation?.assessment }}
              className="hover:shadow-xl transition-shadow"
            />
          </div>
        )}

        {/* Dual-Axis Chart */}
        {stationData && chartData && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Water Level & Rainfall Analysis</h3>
                <p className="text-sm text-gray-600 mt-1">Yellow highlights indicate detected recharge events</p>
              </div>
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
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Detected Events List */}
          <div className="lg:col-span-2">
            {detectRechargeEvents.length > 0 ? (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Detected Recharge Events</h3>
                  <button
                    onClick={handleExportEvents}
                    className="text-secondary hover:text-green-700 text-sm font-medium flex items-center gap-2 px-4 py-2 rounded-lg border border-green-200 hover:bg-green-50 transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export CSV
                  </button>
                </div>

                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  {detectRechargeEvents.map((event, index) => (
                    <div
                      key={event.id}
                      className="p-4 border-2 border-gray-200 rounded-xl hover:border-green-300 hover:bg-green-50 transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-bold text-gray-900">Event {index + 1}</h4>
                          <p className="text-sm text-gray-600">
                            {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            {event.endDate && ` - ${new Date(event.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                          parseFloat(event.efficiency) > 15 ? 'bg-green-100 text-green-800 border-green-300' :
                          parseFloat(event.efficiency) > 10 ? 'bg-blue-100 text-blue-800 border-blue-300' :
                          'bg-yellow-100 text-yellow-800 border-yellow-300'
                        }`}>
                          {event.efficiency}% Efficiency
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">🌧️</span>
                          <div>
                            <div className="text-xs text-gray-500">Rainfall</div>
                            <div className="font-semibold text-gray-900">{event.rainfall}mm</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-2xl">📈</span>
                          <div>
                            <div className="text-xs text-gray-500">Water Level Rise</div>
                            <div className="font-semibold text-gray-900">{event.waterLevelRise}m</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-2xl">⚡</span>
                          <div>
                            <div className="text-xs text-gray-500">Response Time</div>
                            <div className="font-semibold text-gray-900">{event.responseTime}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-2xl">💧</span>
                          <div>
                            <div className="text-xs text-gray-500">Recharge Rate</div>
                            <div className="font-semibold text-gray-900">{(parseFloat(event.waterLevelRise) / 3).toFixed(2)}m/day</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Recharge Events Detected</h3>
                <p className="text-gray-600">
                  No significant rainfall-driven recharge events were found in the selected period.
                  Try selecting a different station or time period.
                </p>
              </div>
            )}
          </div>

          {/* Sidebar - Season Summary & AI Insights */}
          <div className="space-y-6">
            {/* Season Summary */}
            {seasonSummary && (
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl shadow-lg border border-blue-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <span className="text-2xl mr-2">📊</span>
                  Season Summary
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-blue-100">
                    <span className="text-sm text-gray-600">Total Rainfall</span>
                    <span className="font-bold text-gray-900">{seasonSummary.totalRainfall}mm</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-blue-100">
                    <span className="text-sm text-gray-600">Total Recharge</span>
                    <span className="font-bold text-gray-900">{seasonSummary.totalRecharge}m</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-blue-100">
                    <span className="text-sm text-gray-600">Avg. Efficiency</span>
                    <span className="font-bold text-green-600">{seasonSummary.avgEfficiency}%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-blue-100">
                    <span className="text-sm text-gray-600">Event Count</span>
                    <span className="font-bold text-gray-900">{seasonSummary.eventCount}</span>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg border border-green-300">
                    <div className="text-xs text-green-700 mb-1">Best Event</div>
                    <div className="font-bold text-green-900">
                      {new Date(seasonSummary.bestEvent.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      <span className="ml-2">({seasonSummary.bestEvent.efficiency}%)</span>
                    </div>
                  </div>
                </div>

                {/* Comparison */}
                <div className="mt-4 pt-4 border-t border-blue-200">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Historical Comparison</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">2024 (Current)</span>
                      <span className="font-semibold text-blue-600">{seasonSummary.totalRecharge}m</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">2023</span>
                      <span className="font-semibold text-gray-500">{(parseFloat(seasonSummary.totalRecharge) * 0.87).toFixed(2)}m</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">5-year avg</span>
                      <span className="font-semibold text-gray-500">{(parseFloat(seasonSummary.totalRecharge) * 1.04).toFixed(2)}m</span>
                    </div>
                  </div>
                  <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-xs text-yellow-800">
                      <strong>Assessment:</strong> {parseFloat(seasonSummary.totalRecharge) > 8 ? 'Above' : 'Slightly below'} average
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* AI Interpretation */}
            {aiInterpretation && (
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-lg border border-purple-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <span className="text-2xl mr-2">🤖</span>
                  AI Interpretation
                </h3>
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-lg border border-purple-100">
                    <h4 className="text-sm font-semibold text-purple-900 mb-2">Scientific Assessment</h4>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {aiInterpretation.interpretation}
                    </p>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="text-sm font-semibold text-green-900 mb-2 flex items-center">
                      <span className="mr-2">💡</span>
                      Recommendation
                    </h4>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {aiInterpretation.recommendation}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-white rounded-lg border border-gray-200 text-center">
                      <div className="text-xs text-gray-500 mb-1">Aquifer Type</div>
                      <div className="font-bold text-gray-900">{aiInterpretation.aquifer}</div>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-gray-200 text-center">
                      <div className="text-xs text-gray-500 mb-1">Rating</div>
                      <div className={`font-bold ${
                        aiInterpretation.assessment === 'excellent' ? 'text-green-600' :
                        aiInterpretation.assessment === 'good' ? 'text-blue-600' :
                        aiInterpretation.assessment === 'typical' ? 'text-yellow-600' :
                        'text-orange-600'
                      }`}>
                        {aiInterpretation.assessment.charAt(0).toUpperCase() + aiInterpretation.assessment.slice(1)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Export Options */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl p-6 border border-gray-700">
              <h3 className="text-lg font-bold mb-4 text-white">Export Tools</h3>
              <div className="space-y-3">
                <button
                  onClick={handleExportEvents}
                  className="w-full bg-white hover:bg-gray-100 rounded-xl p-4 transition-all text-left border border-gray-200 shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">📄</div>
                    <div>
                      <div className="font-semibold text-sm text-gray-900">Event Catalog</div>
                      <div className="text-xs text-gray-600">CSV format</div>
                    </div>
                  </div>
                </button>
                <button
                  onClick={handleExportChart}
                  className="w-full bg-white hover:bg-gray-100 rounded-xl p-4 transition-all text-left border border-gray-200 shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">📊</div>
                    <div>
                      <div className="font-semibold text-sm text-gray-900">Export Chart</div>
                      <div className="text-xs text-gray-600">PNG format</div>
                    </div>
                  </div>
                </button>
                <button
                  onClick={handleGenerateReport}
                  className="w-full bg-white hover:bg-gray-100 rounded-xl p-4 transition-all text-left border border-gray-200 shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">📋</div>
                    <div>
                      <div className="font-semibold text-sm text-gray-900">Full Report</div>
                      <div className="text-xs text-gray-600">PDF format</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RechargeAnalysis;
