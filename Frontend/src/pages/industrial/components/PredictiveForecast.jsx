// src/pages/industrial/components/PredictiveForecast.jsx
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area } from 'recharts';

const PredictiveForecast = ({ location }) => {
  const [dailyUsage, setDailyUsage] = useState(500000); // liters per day

  // Dummy forecast data
  const forecastData = [
    { month: 'Current', historical: 45.2, forecast: 45.2, confidence: [44.8, 45.6] },
    { month: 'Mar', historical: null, forecast: 47.1, confidence: [46.2, 48.0] },
    { month: 'Apr', historical: null, forecast: 49.3, confidence: [48.0, 50.6] },
    { month: 'May', historical: null, forecast: 52.1, confidence: [50.5, 53.7] },
    { month: 'Jun', historical: null, forecast: 54.8, confidence: [52.8, 56.8] },
    { month: 'Jul', historical: null, forecast: 56.2, confidence: [53.8, 58.6] },
  ];

  // Calculate cost impact
  const calculateCostImpact = () => {
    const currentDepth = 45.2;
    const forecastDepth = 56.2;
    const depthIncrease = forecastDepth - currentDepth;
    
    // Simple cost model: ₹0.5 per liter per additional meter of depth
    const costPerMeter = 0.5;
    const monthlyCostIncrease = (dailyUsage * 30 * depthIncrease * costPerMeter) / 100000; // Convert to lakhs
    
    return {
      depthIncrease,
      monthlyCostIncrease,
      percentageIncrease: ((monthlyCostIncrease / 10) * 100) // Assuming base cost of 10 lakhs
    };
  };

  const costImpact = calculateCostImpact();

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-sm">
          <p className="font-medium text-gray-900">{label}</p>
          {data.historical && (
            <p className="text-blue-600">Historical: {data.historical}m</p>
          )}
          <p className="text-purple-600">Forecast: {data.forecast}m</p>
          <p className="text-gray-500 text-sm">
            Range: {data.confidence[0]}m - {data.confidence[1]}m
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Forecast Chart */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">6-Month Water Level Forecast</h2>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={forecastData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
                label={{ 
                  value: 'Depth (m)', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { textAnchor: 'middle' }
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              
              {/* Historical Data */}
              <Line 
                type="monotone" 
                dataKey="historical" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                name="Historical"
              />
              
              {/* Forecast Data */}
              <Line 
                type="monotone" 
                dataKey="forecast" 
                stroke="#8b5cf6" 
                strokeWidth={3}
                strokeDasharray="5 5"
                dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                name="Forecast"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
          <div className="flex items-center">
            <div className="w-4 h-0.5 bg-blue-500 mr-2"></div>
            <span className="text-gray-600">Historical</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-0.5 bg-purple-500 mr-2 border-dashed border"></div>
            <span className="text-gray-600">Forecast</span>
          </div>
        </div>
      </div>

      {/* Cost Calculator */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Pumping Cost Forecast</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Daily Water Requirement (Liters)
            </label>
            <input
              type="number"
              value={dailyUsage}
              onChange={(e) => setDailyUsage(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min="1000"
              step="1000"
            />
            <p className="text-sm text-gray-500 mt-1">
              Current usage: {(dailyUsage / 1000).toLocaleString()} KL/day
            </p>
          </div>

          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="font-bold text-red-800 text-lg mb-2">Cost Impact Alert</h3>
            <p className="text-red-700">
              Based on the forecast, your estimated pumping energy cost will increase by{' '}
              <span className="font-bold">~{costImpact.percentageIncrease.toFixed(1)}%</span>{' '}
              next quarter due to falling water table.
            </p>
            <div className="mt-3 text-sm">
              <p>Additional pumping depth: <span className="font-semibold">+{costImpact.depthIncrease.toFixed(1)}m</span></p>
              <p>Estimated monthly cost increase: <span className="font-semibold">₹{costImpact.monthlyCostIncrease.toFixed(1)} lakhs</span></p>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">Recommended Actions:</h4>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• Implement water recycling systems to reduce fresh water dependency</li>
            <li>• Optimize pumping schedules during high-water level periods</li>
            <li>• Invest in rainwater harvesting infrastructure</li>
            <li>• Conduct water audit to identify conservation opportunities</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PredictiveForecast;