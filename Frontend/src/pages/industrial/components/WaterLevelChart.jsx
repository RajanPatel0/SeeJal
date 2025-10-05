// src/pages/industrial/components/WaterLevelChart.jsx
import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, ReferenceLine } from 'recharts';
import { Calendar, Filter, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const WaterLevelChart = () => {
  const [timeFilter, setTimeFilter] = useState('6months');

  // Enhanced dummy data for different time periods
  const dataByTimePeriod = {
    '7days': [
      { date: 'Day 1', level: 44.8, isCurrent: false },
      { date: 'Day 2', level: 45.0, isCurrent: false },
      { date: 'Day 3', level: 45.1, isCurrent: false },
      { date: 'Day 4', level: 45.3, isCurrent: false },
      { date: 'Day 5', level: 45.2, isCurrent: false },
      { date: 'Day 6', level: 45.4, isCurrent: false },
      { date: 'Today', level: 45.2, isCurrent: true },
    ],
    '30days': [
      { week: 'Week 1', level: 43.5, isCurrent: false },
      { week: 'Week 2', level: 44.2, isCurrent: false },
      { week: 'Week 3', level: 44.8, isCurrent: false },
      { week: 'Current', level: 45.2, isCurrent: true },
    ],
    '6months': [
      { month: 'Sep', level: 35.1, trend: 'rising', isCurrent: false },
      { month: 'Oct', level: 33.4, trend: 'falling', isCurrent: false },
      { month: 'Nov', level: 36.2, trend: 'rising', isCurrent: false },
      { month: 'Dec', level: 39.8, trend: 'rising', isCurrent: false },
      { month: 'Jan', level: 42.1, trend: 'rising', isCurrent: false },
      { month: 'Feb', level: 45.2, trend: 'rising', isCurrent: true },
    ],
    '1year': [
      { month: 'Mar', level: 32.1, isCurrent: false },
      { month: 'Jun', level: 28.5, isCurrent: false },
      { month: 'Sep', level: 35.1, isCurrent: false },
      { month: 'Dec', level: 39.8, isCurrent: false },
      { month: 'Feb', level: 45.2, isCurrent: true },
    ],
    '2years': [
      { year: '2022', level: 28.5, isCurrent: false },
      { year: '2023', level: 35.2, isCurrent: false },
      { year: '2024', level: 45.2, isCurrent: true },
    ]
  };

  const chartData = dataByTimePeriod[timeFilter];
  const currentDataPoint = chartData.find(item => item.isCurrent);
  const previousDataPoint = chartData[chartData.length - 2];

  // Calculate metrics based on current data
  const metrics = useMemo(() => {
    const levels = chartData.map(item => item.level);
    const lowest = Math.min(...levels);
    const highest = Math.max(...levels);
    const totalChange = currentDataPoint.level - levels[0];
    const avgRate = totalChange / (chartData.length - 1);

    return {
      lowest,
      highest,
      current: currentDataPoint.level,
      totalChange,
      avgRate: parseFloat(avgRate.toFixed(2)),
      trend: totalChange > 0 ? 'rising' : totalChange < 0 ? 'falling' : 'stable'
    };
  }, [chartData, currentDataPoint]);

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'rising': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'falling': return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-blue-600 flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              Water Level: <span className="font-bold ml-1">{payload[0].value}m</span>
            </p>
            {data.isCurrent && (
              <p className="text-green-600 text-sm font-medium bg-green-50 px-2 py-1 rounded">
                Current Reading
              </p>
            )}
            {data.trend && (
              <p className="text-gray-600 text-sm">
                Trend: <span className="capitalize">{data.trend}</span>
              </p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomizedDot = (props) => {
    const { cx, cy, payload } = props;
    
    if (payload.isCurrent) {
      return (
        <g>
          <circle cx={cx} cy={cy} r={8} fill="#3b82f6" stroke="#1d4ed8" strokeWidth={3} />
          <circle cx={cx} cy={cy} r={4} fill="#ffffff" />
        </g>
      );
    }
    
    return (
      <circle cx={cx} cy={cy} r={4} fill="#3b82f6" stroke="#ffffff" strokeWidth={2} />
    );
  };

  const timeFilters = [
    { id: '7days', label: '7 Days', icon: Calendar },
    { id: '30days', label: '30 Days', icon: Calendar },
    { id: '6months', label: '6 Months', icon: Calendar },
    { id: '1year', label: '1 Year', icon: Calendar },
    { id: '2years', label: '2 Years', icon: Calendar },
  ];

  const getXAxisKey = () => {
    switch (timeFilter) {
      case '7days': return 'date';
      case '30days': return 'week';
      case '6months': return 'month';
      case '1year': return 'month';
      case '2years': return 'year';
      default: return 'month';
    }
  };

  const getChartTitle = () => {
    switch (timeFilter) {
      case '7days': return '7-Day Water Level Trend';
      case '30days': return '30-Day Water Level Trend';
      case '6months': return '6-Month Water Level Trend';
      case '1year': return 'Annual Water Level Trend';
      case '2years': return '2-Year Water Level Comparison';
      default: return 'Water Level Trend';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Header with Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 space-y-4 lg:space-y-0">
        <div>
          <h2 className="text-xl font-bold text-gray-800">{getChartTitle()}</h2>
          <div className="flex items-center text-sm text-gray-600 mt-1">
            {getTrendIcon(metrics.trend)}
            <span className="ml-2 capitalize">{metrics.trend} trend • </span>
            <span className="ml-1">{Math.abs(metrics.totalChange).toFixed(1)}m total change</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <div className="flex bg-gray-100 rounded-lg p-1">
            {timeFilters.map((filter) => {
              const Icon = filter.icon;
              return (
                <button
                  key={filter.id}
                  onClick={() => setTimeFilter(filter.id)}
                  className={`flex items-center px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    timeFilter === filter.id
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Icon className="w-3 h-3 mr-1" />
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart 
            data={chartData} 
            margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#f3f4f6" 
              vertical={false}
            />
            <XAxis 
              dataKey={getXAxisKey()}
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: '#e5e7eb' }}
              label={{ 
                value: 'Depth (m)', 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle', fill: '#6b7280' }
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Reference line for current level */}
            <ReferenceLine 
              y={currentDataPoint.level} 
              stroke="#ef4444" 
              strokeDasharray="3 3"
              label={{ 
                value: 'Current', 
                position: 'right',
                fill: '#ef4444',
                fontSize: 12
              }} 
            />
            
            <Line 
              type="monotone" 
              dataKey="level" 
              stroke="#3b82f6" 
              strokeWidth={3}
              dot={<CustomizedDot />}
              activeDot={{ 
                r: 8, 
                fill: '#1d4ed8',
                stroke: '#ffffff',
                strokeWidth: 2
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Key Metrics */}
      <div className="mt-6 grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
          <div className="text-2xl font-bold text-green-700">{metrics.lowest}m</div>
          <div className="text-sm text-green-800 font-medium">Lowest Level</div>
          <div className="text-xs text-green-600 mt-1">
            {chartData.find(item => item.level === metrics.lowest)[getXAxisKey()]}
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
          <div className="text-2xl font-bold text-red-700">{metrics.current}m</div>
          <div className="text-sm text-red-800 font-medium">Current Level</div>
          <div className="text-xs text-red-600 mt-1 flex items-center">
            {getTrendIcon(metrics.trend)}
            <span className="ml-1 capitalize">{metrics.trend}</span>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
          <div className="text-2xl font-bold text-blue-700">{metrics.highest}m</div>
          <div className="text-sm text-blue-800 font-medium">Highest Level</div>
          <div className="text-xs text-blue-600 mt-1">
            {chartData.find(item => item.level === metrics.highest)[getXAxisKey()]}
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
          <div className="text-2xl font-bold text-purple-700">
            {metrics.totalChange > 0 ? '+' : ''}{metrics.totalChange.toFixed(1)}m
          </div>
          <div className="text-sm text-purple-800 font-medium">Net Change</div>
          <div className="text-xs text-purple-600 mt-1">
            Since {chartData[0][getXAxisKey()]}
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
          <div className="text-2xl font-bold text-orange-700">
            {metrics.avgRate > 0 ? '+' : ''}{metrics.avgRate}m
          </div>
          <div className="text-sm text-orange-800 font-medium">Avg. Rate</div>
          <div className="text-xs text-orange-600 mt-1">Per period</div>
        </div>
      </div>

      {/* Trend Analysis */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h4 className="font-semibold text-gray-800 mb-2">Trend Analysis</h4>
        <div className="text-sm text-gray-600">
          {metrics.trend === 'rising' ? (
            <p>
              Water levels show a <span className="text-red-600 font-semibold">rising trend</span> of {Math.abs(metrics.avgRate).toFixed(2)}m per period. 
              This indicates potential recharge events or reduced extraction in the area.
            </p>
          ) : metrics.trend === 'falling' ? (
            <p>
              Water levels show a <span className="text-red-600 font-semibold">declining trend</span> of {Math.abs(metrics.avgRate).toFixed(2)}m per period. 
              Consider reviewing extraction rates and monitoring for sustainable usage.
            </p>
          ) : (
            <p>
              Water levels remain <span className="text-green-600 font-semibold">stable</span>. Current usage patterns appear sustainable for this period.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default WaterLevelChart;