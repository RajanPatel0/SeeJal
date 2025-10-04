import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import DataCard from '../../components/common/DataCard';
import { mockStations } from '../../utils/mockData';

const DataQuality = () => {
  const [selectedStation, setSelectedStation] = useState('all');
  const [showOnlyReliable, setShowOnlyReliable] = useState(false);
  const [sortBy, setSortBy] = useState('quality-desc');

  // Calculate quality score for each station
  const calculateQualityScore = (station) => {
    // Use station ID as seed for consistent scores
    const seed = station.id.split('_')[1] ? parseInt(station.id.split('_')[1]) : 0;

    // Generate consistent metrics based on station ID
    const completeness = 75 + (seed % 25);
    const reliability = 70 + ((seed * 2) % 30);
    const consistency = 80 + ((seed * 3) % 20);
    const latency = 85 + ((seed * 4) % 15);

    const overallScore = Math.round((completeness + reliability + consistency + latency) / 4);

    return {
      overall: overallScore,
      completeness,
      reliability,
      consistency,
      latency,
      status: overallScore >= 80 ? 'excellent' : overallScore >= 50 ? 'fair' : 'poor',
      statusColor: overallScore >= 80 ? 'green' : overallScore >= 50 ? 'yellow' : 'red'
    };
  };

  // Enrich stations with quality data
  const stationsWithQuality = useMemo(() => {
    return mockStations.map(station => {
      const quality = calculateQualityScore(station);

      // Simulate data gaps
      const seed = station.id.split('_')[1] ? parseInt(station.id.split('_')[1]) : 0;
      const hasGaps = seed % 5 === 0;
      const gapCount = hasGaps ? Math.floor(seed % 3) + 1 : 0;

      // Simulate last transmission time
      const hoursAgo = seed % 48;
      const transmissionStatus = hoursAgo < 2 ? 'transmitting' : hoursAgo < 24 ? 'delayed' : 'offline';

      return {
        ...station,
        quality,
        dataGaps: gapCount,
        lastTransmission: hoursAgo,
        transmissionStatus
      };
    });
  }, []);

  // Filter and sort stations
  const filteredStations = useMemo(() => {
    let filtered = stationsWithQuality;

    if (showOnlyReliable) {
      filtered = filtered.filter(s => s.quality.overall >= 80);
    }

    if (selectedStation !== 'all') {
      filtered = filtered.filter(s => s.state === selectedStation);
    }

    // Sort stations
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'quality-desc':
          return b.quality.overall - a.quality.overall;
        case 'quality-asc':
          return a.quality.overall - b.quality.overall;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'gaps-desc':
          return b.dataGaps - a.dataGaps;
        default:
          return 0;
      }
    });

    return filtered;
  }, [stationsWithQuality, showOnlyReliable, selectedStation, sortBy]);

  // Calculate system-wide metrics
  const systemMetrics = useMemo(() => {
    const total = stationsWithQuality.length;
    const transmitting = stationsWithQuality.filter(s => s.transmissionStatus === 'transmitting').length;
    const delayed = stationsWithQuality.filter(s => s.transmissionStatus === 'delayed').length;
    const offline = stationsWithQuality.filter(s => s.transmissionStatus === 'offline').length;

    const excellent = stationsWithQuality.filter(s => s.quality.overall >= 80).length;
    const fair = stationsWithQuality.filter(s => s.quality.overall >= 50 && s.quality.overall < 80).length;
    const poor = stationsWithQuality.filter(s => s.quality.overall < 50).length;

    const avgQuality = Math.round(
      stationsWithQuality.reduce((sum, s) => sum + s.quality.overall, 0) / total
    );

    const withGaps = stationsWithQuality.filter(s => s.dataGaps > 0).length;

    return {
      total,
      transmitting,
      delayed,
      offline,
      excellent,
      fair,
      poor,
      avgQuality,
      withGaps
    };
  }, [stationsWithQuality]);

  // Get unique states
  const states = useMemo(() => {
    return ['all', ...new Set(mockStations.map(s => s.state))];
  }, []);

  const getQualityBadge = (quality) => {
    if (quality >= 80) return 'bg-green-100 text-green-800 border-green-300';
    if (quality >= 50) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-red-100 text-red-800 border-red-300';
  };

  const getTransmissionBadge = (status) => {
    if (status === 'transmitting') return 'bg-green-100 text-green-800 border-green-300';
    if (status === 'delayed') return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-red-100 text-red-800 border-red-300';
  };

  const getStatusIcon = (status) => {
    if (status === 'excellent') return '✅';
    if (status === 'fair') return '⚠️';
    return '❌';
  };

  // Export quality report
  const handleExportReport = () => {
    let csv = 'Station ID,Station Name,District,State,Quality Score,Status,Completeness,Reliability,Consistency,Latency,Data Gaps,Last Transmission (hrs ago)\n';

    filteredStations.forEach(station => {
      csv += `${station.id},${station.name},${station.district},${station.state},${station.quality.overall},${station.quality.status},${station.quality.completeness.toFixed(1)},${station.quality.reliability.toFixed(1)},${station.quality.consistency.toFixed(1)},${station.quality.latency.toFixed(1)},${station.dataGaps},${station.lastTransmission}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `data_quality_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-yellow-50 py-8">
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
            <div className="text-4xl">🏥</div>
            <h1 className="text-4xl font-bold text-gray-900">Data Quality Control Center</h1>
          </div>
          <p className="text-lg text-gray-600">Monitor station reliability and data health metrics for research confidence</p>
        </div>

        {/* Overall System Health Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <DataCard
            title="Total Stations"
            value={systemMetrics.total}
            subtitle="Active monitoring"
            icon="📍"
            className="hover:shadow-xl transition-shadow"
          />
          <DataCard
            title="Transmitting"
            value={systemMetrics.transmitting}
            subtitle={`${((systemMetrics.transmitting / systemMetrics.total) * 100).toFixed(1)}% online`}
            icon="✅"
            trend={{ value: (systemMetrics.transmitting / systemMetrics.total) * 100, label: 'healthy' }}
            className="hover:shadow-xl transition-shadow border-green-200"
          />
          <DataCard
            title="Delayed"
            value={systemMetrics.delayed}
            subtitle={`${((systemMetrics.delayed / systemMetrics.total) * 100).toFixed(1)}% delayed`}
            icon="⚠️"
            className="hover:shadow-xl transition-shadow border-yellow-200"
          />
          <DataCard
            title="Offline"
            value={systemMetrics.offline}
            subtitle={`${((systemMetrics.offline / systemMetrics.total) * 100).toFixed(1)}% offline`}
            icon="❌"
            className="hover:shadow-xl transition-shadow border-red-200"
          />
        </div>

        {/* Quality Distribution */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl shadow-lg border border-green-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-green-900">Excellent Quality</h3>
              <span className="text-3xl">🟢</span>
            </div>
            <div className="text-4xl font-bold text-green-600 mb-1">{systemMetrics.excellent}</div>
            <div className="text-sm text-green-700">Score 80-100 | {((systemMetrics.excellent / systemMetrics.total) * 100).toFixed(1)}% of total</div>
            <div className="mt-3 h-2 bg-green-200 rounded-full overflow-hidden">
              <div className="h-full bg-green-500" style={{ width: `${(systemMetrics.excellent / systemMetrics.total) * 100}%` }}></div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl shadow-lg border border-yellow-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-yellow-900">Fair Quality</h3>
              <span className="text-3xl">🟡</span>
            </div>
            <div className="text-4xl font-bold text-yellow-600 mb-1">{systemMetrics.fair}</div>
            <div className="text-sm text-yellow-700">Score 50-79 | {((systemMetrics.fair / systemMetrics.total) * 100).toFixed(1)}% of total</div>
            <div className="mt-3 h-2 bg-yellow-200 rounded-full overflow-hidden">
              <div className="h-full bg-yellow-500" style={{ width: `${(systemMetrics.fair / systemMetrics.total) * 100}%` }}></div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl shadow-lg border border-red-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-red-900">Poor Quality</h3>
              <span className="text-3xl">🔴</span>
            </div>
            <div className="text-4xl font-bold text-red-600 mb-1">{systemMetrics.poor}</div>
            <div className="text-sm text-red-700">Score 0-49 | {((systemMetrics.poor / systemMetrics.total) * 100).toFixed(1)}% of total</div>
            <div className="mt-3 h-2 bg-red-200 rounded-full overflow-hidden">
              <div className="h-full bg-red-500" style={{ width: `${(systemMetrics.poor / systemMetrics.total) * 100}%` }}></div>
            </div>
          </div>
        </div>

        {/* Filters & Controls */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Filter & Sort</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Filter by State</label>
              <select
                value={selectedStation}
                onChange={(e) => setSelectedStation(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              >
                {states.map(state => (
                  <option key={state} value={state}>
                    {state === 'all' ? 'All States' : state}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Sort by</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              >
                <option value="quality-desc">Quality Score (High to Low)</option>
                <option value="quality-asc">Quality Score (Low to High)</option>
                <option value="name">Station Name (A-Z)</option>
                <option value="gaps-desc">Most Data Gaps</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Quick Filter</label>
              <label className="flex items-center h-[52px] px-4 py-3 border-2 border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition-all">
                <input
                  type="checkbox"
                  checked={showOnlyReliable}
                  onChange={(e) => setShowOnlyReliable(e.target.checked)}
                  className="h-5 w-5 text-primary focus:ring-primary rounded"
                />
                <span className="ml-3 text-sm font-medium text-gray-700">Show only reliable (80+)</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Export</label>
              <button
                onClick={handleExportReport}
                className="w-full h-[52px] bg-primary hover:bg-blue-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export Report
              </button>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
            <span className="font-semibold">Showing: {filteredStations.length} stations</span>
            <span>|</span>
            <span>Avg. Quality: {systemMetrics.avgQuality}%</span>
            <span>|</span>
            <span>{systemMetrics.withGaps} stations with data gaps</span>
          </div>
        </div>

        {/* Station Quality Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Station Quality Assessment</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-4 font-bold text-gray-700">Station</th>
                  <th className="text-left py-3 px-4 font-bold text-gray-700">Location</th>
                  <th className="text-center py-3 px-4 font-bold text-gray-700">Quality Score</th>
                  <th className="text-center py-3 px-4 font-bold text-gray-700">Status</th>
                  <th className="text-center py-3 px-4 font-bold text-gray-700">Completeness</th>
                  <th className="text-center py-3 px-4 font-bold text-gray-700">Reliability</th>
                  <th className="text-center py-3 px-4 font-bold text-gray-700">Consistency</th>
                  <th className="text-center py-3 px-4 font-bold text-gray-700">Latency</th>
                  <th className="text-center py-3 px-4 font-bold text-gray-700">Data Gaps</th>
                  <th className="text-center py-3 px-4 font-bold text-gray-700">Last Seen</th>
                </tr>
              </thead>
              <tbody>
                {filteredStations.map(station => (
                  <tr key={station.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-gray-900">{station.name}</div>
                      <div className="text-xs text-gray-500">{station.id}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-gray-700">{station.district}</div>
                      <div className="text-xs text-gray-500">{station.state}</div>
                    </td>
                    <td className="text-center py-3 px-4">
                      <div className="text-2xl font-bold" style={{
                        color: station.quality.overall >= 80 ? '#0e9f6e' :
                               station.quality.overall >= 50 ? '#f59e0b' : '#ef4444'
                      }}>
                        {station.quality.overall}
                      </div>
                    </td>
                    <td className="text-center py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${getQualityBadge(station.quality.overall)}`}>
                        {getStatusIcon(station.quality.status)}
                        {station.quality.status}
                      </span>
                    </td>
                    <td className="text-center py-3 px-4">
                      <div className="flex flex-col items-center">
                        <span className="font-semibold text-gray-900">{station.quality.completeness.toFixed(0)}%</span>
                        <div className="w-16 h-1.5 bg-gray-200 rounded-full mt-1 overflow-hidden">
                          <div
                            className="h-full bg-blue-500"
                            style={{ width: `${station.quality.completeness}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="text-center py-3 px-4">
                      <div className="flex flex-col items-center">
                        <span className="font-semibold text-gray-900">{station.quality.reliability.toFixed(0)}%</span>
                        <div className="w-16 h-1.5 bg-gray-200 rounded-full mt-1 overflow-hidden">
                          <div
                            className="h-full bg-green-500"
                            style={{ width: `${station.quality.reliability}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="text-center py-3 px-4">
                      <div className="flex flex-col items-center">
                        <span className="font-semibold text-gray-900">{station.quality.consistency.toFixed(0)}%</span>
                        <div className="w-16 h-1.5 bg-gray-200 rounded-full mt-1 overflow-hidden">
                          <div
                            className="h-full bg-purple-500"
                            style={{ width: `${station.quality.consistency}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="text-center py-3 px-4">
                      <div className="flex flex-col items-center">
                        <span className="font-semibold text-gray-900">{station.quality.latency.toFixed(0)}%</span>
                        <div className="w-16 h-1.5 bg-gray-200 rounded-full mt-1 overflow-hidden">
                          <div
                            className="h-full bg-orange-500"
                            style={{ width: `${station.quality.latency}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="text-center py-3 px-4">
                      {station.dataGaps > 0 ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-300">
                          {station.dataGaps} gaps
                        </span>
                      ) : (
                        <span className="text-gray-400">None</span>
                      )}
                    </td>
                    <td className="text-center py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold border ${getTransmissionBadge(station.transmissionStatus)}`}>
                        {station.lastTransmission < 2 ? 'Now' :
                         station.lastTransmission < 24 ? `${station.lastTransmission}h ago` :
                         `${Math.floor(station.lastTransmission / 24)}d ago`}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredStations.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Stations Found</h3>
              <p className="text-gray-600">Try adjusting your filters to see more results.</p>
            </div>
          )}
        </div>

        {/* Quality Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* System Health Assessment */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl shadow-lg border border-blue-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <span className="text-2xl mr-2">📊</span>
              System Health Assessment
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-lg border border-blue-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">Overall System Health</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    systemMetrics.avgQuality >= 80 ? 'bg-green-100 text-green-800' :
                    systemMetrics.avgQuality >= 60 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {systemMetrics.avgQuality >= 80 ? 'Excellent' :
                     systemMetrics.avgQuality >= 60 ? 'Good' : 'Needs Attention'}
                  </span>
                </div>
                <div className="text-3xl font-bold text-blue-600 mb-2">{systemMetrics.avgQuality}%</div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                    style={{ width: `${systemMetrics.avgQuality}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white rounded-lg border border-gray-200">
                  <div className="text-xs text-gray-500 mb-1">Transmission Rate</div>
                  <div className="text-lg font-bold text-green-600">
                    {((systemMetrics.transmitting / systemMetrics.total) * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="p-3 bg-white rounded-lg border border-gray-200">
                  <div className="text-xs text-gray-500 mb-1">Stations w/ Gaps</div>
                  <div className="text-lg font-bold text-orange-600">
                    {((systemMetrics.withGaps / systemMetrics.total) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-lg border border-purple-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <span className="text-2xl mr-2">🤖</span>
              AI Recommendations
            </h3>
            <div className="space-y-3">
              {systemMetrics.offline > 5 && (
                <div className="p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
                  <h4 className="font-semibold text-red-900 mb-1 text-sm">Critical: Offline Stations</h4>
                  <p className="text-sm text-gray-700 mb-2">
                    {systemMetrics.offline} stations are currently offline. Immediate inspection required.
                  </p>
                  <button className="text-xs text-red-700 font-semibold hover:text-red-900">
                    View Offline Stations →
                  </button>
                </div>
              )}

              {systemMetrics.withGaps > 10 && (
                <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                  <h4 className="font-semibold text-yellow-900 mb-1 text-sm">Warning: Data Gaps Detected</h4>
                  <p className="text-sm text-gray-700 mb-2">
                    {systemMetrics.withGaps} stations have data gaps. Review transmission logs.
                  </p>
                  <button className="text-xs text-yellow-700 font-semibold hover:text-yellow-900">
                    Investigate Gaps →
                  </button>
                </div>
              )}

              <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                <h4 className="font-semibold text-green-900 mb-1 text-sm">Success: High Quality Network</h4>
                <p className="text-sm text-gray-700 mb-2">
                  {systemMetrics.excellent} stations ({((systemMetrics.excellent / systemMetrics.total) * 100).toFixed(0)}%) maintain excellent quality scores.
                </p>
                <button className="text-xs text-green-700 font-semibold hover:text-green-900">
                  View Best Practices →
                </button>
              </div>

              {systemMetrics.avgQuality >= 80 && (
                <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <h4 className="font-semibold text-blue-900 mb-1 text-sm">System Status: Optimal</h4>
                  <p className="text-sm text-gray-700">
                    Overall system health is excellent. Continue current monitoring protocols.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataQuality;
