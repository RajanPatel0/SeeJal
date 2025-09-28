import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { mockStations } from '../utils/mockData';

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
  const [selectedState, setSelectedState] = useState('all');
  const [timeRange, setTimeRange] = useState('30days');

  const states = ['all', ...new Set(mockStations.map(station => station.state))];

  // State-wise analysis
  const stateAnalysis = useMemo(() => {
    const analysis = {};
    
    mockStations.forEach(station => {
      if (!analysis[station.state]) {
        analysis[station.state] = {
          total: 0,
          critical: 0,
          safe: 0,
          avgLevel: 0,
          levels: []
        };
      }
      
      analysis[station.state].total++;
      analysis[station.state].levels.push(station.currentLevel);
      
      if (station.status === 'critical') analysis[station.state].critical++;
      if (station.status === 'safe') analysis[station.state].safe++;
    });

    // Calculate averages
    Object.keys(analysis).forEach(state => {
      analysis[state].avgLevel = analysis[state].levels.reduce((a, b) => a + b, 0) / analysis[state].levels.length;
    });

    return analysis;
  }, []);

  const stateWiseData = {
    labels: Object.keys(stateAnalysis),
    datasets: [
      {
        label: 'Safe Stations',
        data: Object.values(stateAnalysis).map(state => state.safe),
        backgroundColor: '#0e9f6e',
      },
      {
        label: 'Critical Stations',
        data: Object.values(stateAnalysis).map(state => state.critical),
        backgroundColor: '#f05252',
      }
    ]
  };

  const levelTrendData = {
    labels: Object.keys(stateAnalysis),
    datasets: [
      {
        label: 'Average Water Level (m)',
        data: Object.values(stateAnalysis).map(state => state.avgLevel),
        borderColor: '#1a56db',
        backgroundColor: 'rgba(26, 86, 219, 0.1)',
        fill: true,
        tension: 0.4,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      }
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-dark mb-2">{t('analytics')}</h1>
          <p className="text-gray-600">Advanced analytics and comparative analysis</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
              <select 
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {states.map(state => (
                  <option key={state} value={state}>
                    {state === 'all' ? 'All States' : state}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time Range</label>
              <select 
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="90days">Last 90 Days</option>
                <option value="1year">Last Year</option>
              </select>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* State-wise Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-dark mb-4">State-wise Station Distribution</h3>
            <div className="h-80">
              <Bar data={stateWiseData} options={chartOptions} />
            </div>
          </div>

          {/* Average Water Levels */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-dark mb-4">Average Water Levels by State</h3>
            <div className="h-80">
              <Line data={levelTrendData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-3xl font-bold text-primary mb-2">
              {mockStations.filter(s => s.status === 'critical').length}
            </div>
            <div className="text-gray-600">Critical Stations</div>
            <div className="text-sm text-red-600 mt-1">Requires Immediate Attention</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-3xl font-bold text-secondary mb-2">
              {(mockStations.reduce((sum, station) => sum + station.currentLevel, 0) / mockStations.length).toFixed(1)}m
            </div>
            <div className="text-gray-600">National Average Level</div>
            <div className="text-sm text-green-600 mt-1">Within Safe Limits</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-3xl font-bold text-accent mb-2">
              {Math.max(...mockStations.map(s => s.currentLevel))}m
            </div>
            <div className="text-gray-600">Deepest Water Level</div>
            <div className="text-sm text-orange-600 mt-1">Punjab Region</div>
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
                  <th className="text-right py-3 font-medium">Total Stations</th>
                  <th className="text-right py-3 font-medium">Critical</th>
                  <th className="text-right py-3 font-medium">Safe</th>
                  <th className="text-right py-3 font-medium">Avg. Level (m)</th>
                  <th className="text-right py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(stateAnalysis).map(([state, data]) => (
                  <tr key={state} className="border-b hover:bg-gray-50">
                    <td className="py-3 font-medium">{state}</td>
                    <td className="text-right py-3">{data.total}</td>
                    <td className="text-right py-3 text-red-600">{data.critical}</td>
                    <td className="text-right py-3 text-green-600">{data.safe}</td>
                    <td className="text-right py-3">{data.avgLevel.toFixed(1)}</td>
                    <td className="text-right py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        data.critical / data.total > 0.3 
                          ? 'bg-red-100 text-red-800'
                          : data.critical / data.total > 0.1
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {data.critical / data.total > 0.3 ? 'Critical' : data.critical / data.total > 0.1 ? 'Watch' : 'Good'}
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