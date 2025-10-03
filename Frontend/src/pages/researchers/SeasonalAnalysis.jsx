import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Line, Radar } from 'react-chartjs-2';
import { mockStations } from '../../utils/mockData';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

const SeasonalAnalysis = () => {
  const [selectedStation, setSelectedStation] = useState(mockStations[0].id);
  const [selectedYear, setSelectedYear] = useState('2024');

  const years = ['2024', '2023', '2022', '2021', '2020', '5-Year Avg'];

  // Generate seasonal data for a station
  const generateSeasonalData = (stationId, year) => {
    const seed = parseInt(stationId.split('_')[1] || '0');
    const yearNum = year === '5-Year Avg' ? 2022 : parseInt(year);
    const yearOffset = 2024 - yearNum;

    // Base levels with variation
    const baseLevel = 10 + (seed % 15);
    const yearTrend = -0.3 * yearOffset; // Declining trend over years

    const seasons = {
      preMonsoon: {
        name: 'Pre-Monsoon (Mar-May)',
        months: ['Mar', 'Apr', 'May'],
        avgLevel: baseLevel - 4 + yearTrend + (seed % 3) * 0.5,
        minLevel: baseLevel - 6 + yearTrend,
        maxLevel: baseLevel - 2 + yearTrend,
        decline: 1.2 + (seed % 10) * 0.1,
        color: '#dc2626'
      },
      monsoon: {
        name: 'Monsoon (Jun-Sep)',
        months: ['Jun', 'Jul', 'Aug', 'Sep'],
        avgLevel: baseLevel + 2 + yearTrend + (seed % 4) * 0.3,
        minLevel: baseLevel - 2 + yearTrend,
        maxLevel: baseLevel + 5 + yearTrend,
        recharge: 6.5 + (seed % 15) * 0.2,
        color: '#0e9f6e'
      },
      postMonsoon: {
        name: 'Post-Monsoon (Oct-Nov)',
        months: ['Oct', 'Nov'],
        avgLevel: baseLevel + 3 + yearTrend + (seed % 3) * 0.4,
        minLevel: baseLevel + 1 + yearTrend,
        maxLevel: baseLevel + 5 + yearTrend,
        retention: 85 + (seed % 10),
        color: '#1a56db'
      },
      winter: {
        name: 'Winter (Dec-Feb)',
        months: ['Dec', 'Jan', 'Feb'],
        avgLevel: baseLevel + 1 + yearTrend + (seed % 2) * 0.5,
        minLevel: baseLevel - 1 + yearTrend,
        maxLevel: baseLevel + 3 + yearTrend,
        depletion: 0.8 + (seed % 8) * 0.1,
        color: '#7c3aed'
      }
    };

    return seasons;
  };

  // Calculate current season
  const getCurrentSeason = () => {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return 'preMonsoon';
    if (month >= 5 && month <= 8) return 'monsoon';
    if (month >= 9 && month <= 10) return 'postMonsoon';
    return 'winter';
  };

  const currentSeason = getCurrentSeason();
  const currentSeasonNames = {
    preMonsoon: 'Pre-Monsoon',
    monsoon: 'Monsoon',
    postMonsoon: 'Post-Monsoon',
    winter: 'Winter'
  };

  // Get seasonal data for selected station and year
  const seasonalData = useMemo(() => {
    return generateSeasonalData(selectedStation, selectedYear);
  }, [selectedStation, selectedYear]);

  // Generate multi-year comparison data
  const multiYearData = useMemo(() => {
    const data = {};
    years.forEach(year => {
      if (year !== '5-Year Avg') {
        data[year] = generateSeasonalData(selectedStation, year);
      }
    });

    // Calculate 5-year average
    const avgSeasons = {
      preMonsoon: { avgLevel: 0, minLevel: 0, maxLevel: 0, decline: 0 },
      monsoon: { avgLevel: 0, minLevel: 0, maxLevel: 0, recharge: 0 },
      postMonsoon: { avgLevel: 0, minLevel: 0, maxLevel: 0, retention: 0 },
      winter: { avgLevel: 0, minLevel: 0, maxLevel: 0, depletion: 0 }
    };

    const yearKeys = Object.keys(data);
    yearKeys.forEach(year => {
      Object.keys(avgSeasons).forEach(season => {
        avgSeasons[season].avgLevel += data[year][season].avgLevel / yearKeys.length;
        avgSeasons[season].minLevel += data[year][season].minLevel / yearKeys.length;
        avgSeasons[season].maxLevel += data[year][season].maxLevel / yearKeys.length;
        if (data[year][season].decline) avgSeasons[season].decline += data[year][season].decline / yearKeys.length;
        if (data[year][season].recharge) avgSeasons[season].recharge += data[year][season].recharge / yearKeys.length;
        if (data[year][season].retention) avgSeasons[season].retention += data[year][season].retention / yearKeys.length;
        if (data[year][season].depletion) avgSeasons[season].depletion += data[year][season].depletion / yearKeys.length;
      });
    });

    data['5-Year Avg'] = {
      preMonsoon: { ...seasonalData.preMonsoon, ...avgSeasons.preMonsoon },
      monsoon: { ...seasonalData.monsoon, ...avgSeasons.monsoon },
      postMonsoon: { ...seasonalData.postMonsoon, ...avgSeasons.postMonsoon },
      winter: { ...seasonalData.winter, ...avgSeasons.winter }
    };

    return data;
  }, [selectedStation]);

  // Calculate monsoon effectiveness
  const monsoonEffectiveness = useMemo(() => {
    const recharge = seasonalData.monsoon.recharge;
    const retention = seasonalData.postMonsoon.retention;
    const score = Math.min(100, Math.round((recharge * 10 + retention) / 2));

    let rating = 'Poor';
    let color = 'red';
    if (score >= 80) { rating = 'Excellent'; color = 'green'; }
    else if (score >= 60) { rating = 'Good'; color = 'blue'; }
    else if (score >= 40) { rating = 'Fair'; color = 'yellow'; }

    return { score, rating, color };
  }, [seasonalData]);

  // Seasonal pattern chart data
  const seasonalPatternChart = useMemo(() => {
    const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const seed = parseInt(selectedStation.split('_')[1] || '0');

    const datasets = Object.keys(multiYearData).slice(0, 6).map((year, idx) => {
      const yearData = multiYearData[year];
      const monthlyLevels = monthLabels.map((month, i) => {
        if (i >= 2 && i <= 4) return yearData.preMonsoon.avgLevel + (Math.random() - 0.5);
        if (i >= 5 && i <= 8) return yearData.monsoon.avgLevel + (Math.random() - 0.5);
        if (i >= 9 && i <= 10) return yearData.postMonsoon.avgLevel + (Math.random() - 0.5);
        return yearData.winter.avgLevel + (Math.random() - 0.5);
      });

      const colors = ['#1a56db', '#0e9f6e', '#dc2626', '#f59e0b', '#7c3aed', '#6b7280'];
      const isAvg = year === '5-Year Avg';

      return {
        label: year,
        data: monthlyLevels,
        borderColor: colors[idx % colors.length],
        backgroundColor: isAvg ? 'rgba(26, 86, 219, 0.1)' : 'transparent',
        borderWidth: isAvg ? 3 : 2,
        borderDash: isAvg ? [5, 5] : [],
        pointRadius: isAvg ? 0 : 3,
        tension: 0.4
      };
    });

    return {
      labels: monthLabels,
      datasets
    };
  }, [selectedStation, multiYearData]);

  // Climate trend chart
  const climateTrendChart = useMemo(() => {
    const trendYears = ['2020', '2021', '2022', '2023', '2024'];
    const seed = parseInt(selectedStation.split('_')[1] || '0');

    return {
      labels: trendYears,
      datasets: [
        {
          label: 'Annual Recharge (m)',
          data: trendYears.map((y, i) => 6.5 - i * 0.3 + (seed % 5) * 0.2),
          borderColor: '#0e9f6e',
          backgroundColor: 'rgba(14, 159, 110, 0.1)',
          fill: true,
          tension: 0.4
        },
        {
          label: 'Annual Depletion (m)',
          data: trendYears.map((y, i) => 4.2 + i * 0.2 + (seed % 4) * 0.15),
          borderColor: '#dc2626',
          backgroundColor: 'rgba(220, 38, 38, 0.1)',
          fill: true,
          tension: 0.4
        }
      ]
    };
  }, [selectedStation]);

  // Seasonal phase diagram (radar chart)
  const phaseData = useMemo(() => {
    return {
      labels: ['Pre-Monsoon\nDepletion', 'Monsoon\nRecharge', 'Post-Monsoon\nRetention', 'Winter\nModerate Use'],
      datasets: [
        {
          label: selectedYear,
          data: [
            seasonalData.preMonsoon.decline * 10,
            seasonalData.monsoon.recharge * 10,
            seasonalData.postMonsoon.retention,
            100 - seasonalData.winter.depletion * 10
          ],
          backgroundColor: 'rgba(26, 86, 219, 0.2)',
          borderColor: '#1a56db',
          borderWidth: 2,
          pointRadius: 4
        },
        {
          label: '5-Year Average',
          data: [
            multiYearData['5-Year Avg'].preMonsoon.decline * 10,
            multiYearData['5-Year Avg'].monsoon.recharge * 10,
            multiYearData['5-Year Avg'].postMonsoon.retention,
            100 - multiYearData['5-Year Avg'].winter.depletion * 10
          ],
          backgroundColor: 'rgba(107, 114, 128, 0.1)',
          borderColor: '#6b7280',
          borderWidth: 2,
          borderDash: [5, 5],
          pointRadius: 4
        }
      ]
    };
  }, [seasonalData, selectedYear, multiYearData]);

  // Export functions
  const handleExportSummary = () => {
    const station = mockStations.find(s => s.id === selectedStation);
    let csv = `Seasonal Analysis Summary - ${station.name}\n`;
    csv += `Year: ${selectedYear}\n`;
    csv += `Generated: ${new Date().toLocaleDateString()}\n\n`;
    csv += `Season,Average Level (m),Min Level (m),Max Level (m),Key Metric,Value\n`;
    csv += `Pre-Monsoon,${seasonalData.preMonsoon.avgLevel.toFixed(2)},${seasonalData.preMonsoon.minLevel.toFixed(2)},${seasonalData.preMonsoon.maxLevel.toFixed(2)},Decline Rate (m/month),${seasonalData.preMonsoon.decline.toFixed(2)}\n`;
    csv += `Monsoon,${seasonalData.monsoon.avgLevel.toFixed(2)},${seasonalData.monsoon.minLevel.toFixed(2)},${seasonalData.monsoon.maxLevel.toFixed(2)},Total Recharge (m),${seasonalData.monsoon.recharge.toFixed(2)}\n`;
    csv += `Post-Monsoon,${seasonalData.postMonsoon.avgLevel.toFixed(2)},${seasonalData.postMonsoon.minLevel.toFixed(2)},${seasonalData.postMonsoon.maxLevel.toFixed(2)},Retention (%),${seasonalData.postMonsoon.retention.toFixed(1)}\n`;
    csv += `Winter,${seasonalData.winter.avgLevel.toFixed(2)},${seasonalData.winter.minLevel.toFixed(2)},${seasonalData.winter.maxLevel.toFixed(2)},Depletion Rate (m/month),${seasonalData.winter.depletion.toFixed(2)}\n`;
    csv += `\nMonsoon Effectiveness Score: ${monsoonEffectiveness.score}/100 (${monsoonEffectiveness.rating})\n`;

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `seasonal_summary_${selectedStation}_${selectedYear}.csv`;
    a.click();
  };

  const handleExportData = () => {
    const station = mockStations.find(s => s.id === selectedStation);
    const data = {
      station: { id: station.id, name: station.name, location: station.location },
      year: selectedYear,
      generated: new Date().toISOString(),
      seasons: seasonalData,
      monsoonEffectiveness,
      climateTrend: {
        years: ['2020', '2021', '2022', '2023', '2024'],
        recharge: climateTrendChart.datasets[0].data,
        depletion: climateTrendChart.datasets[1].data
      }
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `seasonal_data_${selectedStation}_${selectedYear}.json`;
    a.click();
  };

  const selectedStationData = mockStations.find(s => s.id === selectedStation);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/researchers" className="text-primary hover:text-blue-700 text-sm font-medium mb-4 inline-flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Researcher Hub
          </Link>
          <h1 className="text-3xl font-bold text-dark mb-2">📅 Seasonal Intelligence</h1>
          <p className="text-gray-600">Analyze groundwater patterns across India's seasonal cycles with multi-year comparisons</p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Station</label>
              <select
                value={selectedStation}
                onChange={(e) => setSelectedStation(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {mockStations.map(station => (
                  <option key={station.id} value={station.id}>
                    {station.name} - {station.location}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Year</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Current Status Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl shadow-lg p-6 mb-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium opacity-90 mb-1">Current Season</div>
              <div className="text-2xl font-bold">{currentSeasonNames[currentSeason]}</div>
              <div className="text-sm opacity-90 mt-1">
                {selectedStationData.name} • Water Level: {seasonalData[currentSeason].avgLevel.toFixed(2)}m
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium opacity-90 mb-1">Monsoon Effectiveness</div>
              <div className="text-3xl font-bold">{monsoonEffectiveness.score}/100</div>
              <div className="text-sm opacity-90 mt-1">{monsoonEffectiveness.rating}</div>
            </div>
          </div>
        </div>

        {/* Seasonal Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {Object.entries(seasonalData).map(([key, season]) => (
            <div key={key} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-dark">{season.name}</h3>
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: season.color }}></div>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-500">Average Level</div>
                  <div className="text-2xl font-bold text-dark">{season.avgLevel.toFixed(2)}m</div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <div className="text-gray-500">Min</div>
                    <div className="font-semibold">{season.minLevel.toFixed(2)}m</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Max</div>
                    <div className="font-semibold">{season.maxLevel.toFixed(2)}m</div>
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  {season.decline && (
                    <div className="text-sm">
                      <span className="text-gray-500">Decline: </span>
                      <span className="font-semibold text-red-600">{season.decline.toFixed(2)}m/month</span>
                    </div>
                  )}
                  {season.recharge && (
                    <div className="text-sm">
                      <span className="text-gray-500">Recharge: </span>
                      <span className="font-semibold text-green-600">{season.recharge.toFixed(2)}m</span>
                    </div>
                  )}
                  {season.retention && (
                    <div className="text-sm">
                      <span className="text-gray-500">Retention: </span>
                      <span className="font-semibold text-blue-600">{season.retention.toFixed(1)}%</span>
                    </div>
                  )}
                  {season.depletion && (
                    <div className="text-sm">
                      <span className="text-gray-500">Depletion: </span>
                      <span className="font-semibold text-orange-600">{season.depletion.toFixed(2)}m/month</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Seasonal Pattern Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-xl font-bold text-dark mb-4">📈 Seasonal Pattern - Multi-Year Comparison</h3>
          <div className="h-96">
            <Line
              data={seasonalPatternChart}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'top' },
                  title: { display: false }
                },
                scales: {
                  y: {
                    title: { display: true, text: 'Water Level (m below ground)' },
                    reverse: true
                  },
                  x: {
                    title: { display: true, text: 'Month' }
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Year-over-Year Comparison Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-xl font-bold text-dark mb-4">📊 Year-over-Year Seasonal Comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Year</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Pre-Monsoon Avg</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Monsoon Recharge</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Post-Monsoon Avg</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Winter Avg</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Annual Range</th>
                </tr>
              </thead>
              <tbody>
                {years.map(year => {
                  const data = multiYearData[year];
                  const range = Math.max(
                    data.preMonsoon.maxLevel,
                    data.monsoon.maxLevel,
                    data.postMonsoon.maxLevel,
                    data.winter.maxLevel
                  ) - Math.min(
                    data.preMonsoon.minLevel,
                    data.monsoon.minLevel,
                    data.postMonsoon.minLevel,
                    data.winter.minLevel
                  );

                  return (
                    <tr key={year} className={`border-b border-gray-100 hover:bg-gray-50 ${year === '5-Year Avg' ? 'font-semibold bg-blue-50' : ''}`}>
                      <td className="py-3 px-4">{year}</td>
                      <td className="text-center py-3 px-4">{data.preMonsoon.avgLevel.toFixed(2)}m</td>
                      <td className="text-center py-3 px-4 text-green-600">{data.monsoon.recharge.toFixed(2)}m</td>
                      <td className="text-center py-3 px-4">{data.postMonsoon.avgLevel.toFixed(2)}m</td>
                      <td className="text-center py-3 px-4">{data.winter.avgLevel.toFixed(2)}m</td>
                      <td className="text-center py-3 px-4">{range.toFixed(2)}m</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Monsoon Effectiveness & Climate Trend */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Monsoon Effectiveness */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-dark mb-4">💧 Monsoon Effectiveness Analysis</h3>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Overall Score</span>
                <span className={`text-2xl font-bold text-${monsoonEffectiveness.color}-600`}>
                  {monsoonEffectiveness.score}/100
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className={`bg-${monsoonEffectiveness.color}-600 h-4 rounded-full transition-all`}
                  style={{ width: `${monsoonEffectiveness.score}%` }}
                ></div>
              </div>
              <div className="text-center mt-2">
                <span className={`inline-block px-4 py-1 rounded-full text-sm font-semibold text-white bg-${monsoonEffectiveness.color}-600`}>
                  {monsoonEffectiveness.rating}
                </span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Monsoon Recharge</span>
                <span className="font-semibold text-green-600">{seasonalData.monsoon.recharge.toFixed(2)}m</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Post-Monsoon Retention</span>
                <span className="font-semibold text-blue-600">{seasonalData.postMonsoon.retention.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Recovery Potential</span>
                <span className="font-semibold text-purple-600">
                  {(seasonalData.monsoon.maxLevel - seasonalData.preMonsoon.minLevel).toFixed(2)}m
                </span>
              </div>
            </div>
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start">
                <span className="text-2xl mr-3">🤖</span>
                <div className="text-sm text-gray-700">
                  <strong>AI Insight:</strong> The {selectedYear} monsoon season showed {monsoonEffectiveness.rating.toLowerCase()} recharge
                  effectiveness with {seasonalData.monsoon.recharge.toFixed(2)}m recovery. Post-monsoon retention of {seasonalData.postMonsoon.retention.toFixed(1)}%
                  indicates {seasonalData.postMonsoon.retention > 80 ? 'good aquifer storage capacity' : 'potential for improved water conservation'}.
                </div>
              </div>
            </div>
          </div>

          {/* Climate Trend */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-dark mb-4">🌡️ Climate Trend Analysis (5-Year)</h3>
            <div className="h-80">
              <Line
                data={climateTrendChart}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: 'top' },
                    title: { display: false }
                  },
                  scales: {
                    y: {
                      title: { display: true, text: 'Magnitude (meters)' },
                      beginAtZero: true
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Seasonal Phase Diagram */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-xl font-bold text-dark mb-4">🔄 Seasonal Phase Diagram</h3>
          <div className="h-96 flex items-center justify-center">
            <div className="w-full max-w-2xl">
              <Radar
                data={phaseData}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  plugins: {
                    legend: { position: 'top' }
                  },
                  scales: {
                    r: {
                      beginAtZero: true,
                      max: 100,
                      ticks: { stepSize: 20 }
                    }
                  }
                }}
              />
            </div>
          </div>
          <div className="mt-4 text-center text-sm text-gray-600">
            Normalized seasonal metrics (0-100 scale) showing the intensity of each seasonal phase
          </div>
        </div>

        {/* Export Options */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl p-6 border border-gray-700">
          <h3 className="text-xl font-bold mb-4 text-white">📥 Export Options</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={handleExportSummary}
              className="bg-white hover:bg-gray-100 rounded-xl p-4 text-left transition-colors"
            >
              <div className="font-semibold text-gray-900 mb-1">📄 Export Summary (CSV)</div>
              <div className="text-sm text-gray-600">Seasonal metrics and statistics</div>
            </button>
            <button
              onClick={handleExportData}
              className="bg-white hover:bg-gray-100 rounded-xl p-4 text-left transition-colors"
            >
              <div className="font-semibold text-gray-900 mb-1">📊 Export Full Data (JSON)</div>
              <div className="text-sm text-gray-600">Complete seasonal analysis dataset</div>
            </button>
            <button
              onClick={() => alert('Chart export functionality coming soon!')}
              className="bg-white hover:bg-gray-100 rounded-xl p-4 text-left transition-colors"
            >
              <div className="font-semibold text-gray-900 mb-1">📈 Export Charts (PNG)</div>
              <div className="text-sm text-gray-600">All visualizations as images</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeasonalAnalysis;
