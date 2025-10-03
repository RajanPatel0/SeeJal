// src/pages/industrial/components/ExtractionScheduler.jsx
import React, { useState } from 'react';
import { Calendar, Droplets, Zap, AlertTriangle } from 'lucide-react';

const ExtractionScheduler = ({ location }) => {
  const [selectedMonth, setSelectedMonth] = useState('february');

  const monthlyData = {
    january: { quota: 8.5, usage: 7.2, status: 'good', recommendation: 'Normal operations' },
    february: { quota: 7.2, usage: 6.8, status: 'good', recommendation: 'Slight reduction advised' },
    march: { quota: 6.0, usage: null, status: 'caution', recommendation: 'Reduce extraction by 20%' },
    april: { quota: 5.5, usage: null, status: 'warning', recommendation: 'Reduce extraction by 35%' },
    may: { quota: 4.8, usage: null, status: 'critical', recommendation: 'Minimal extraction only' },
  };

  const rechargeZones = [
    { name: 'Northern Catchment', distance: '2.1km', potential: 'High', type: 'Natural' },
    { name: 'Eastern Reservoir', distance: '3.4km', potential: 'Medium', type: 'Artificial' },
    { name: 'Southern Basin', distance: '1.8km', potential: 'High', type: 'Natural' },
  ];

  const currentMonth = monthlyData[selectedMonth];

  const getStatusColor = (status) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-100';
      case 'caution': return 'text-yellow-600 bg-yellow-100';
      case 'warning': return 'text-orange-600 bg-orange-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'good': return <Droplets className="w-5 h-5" />;
      case 'caution': return <AlertTriangle className="w-5 h-5" />;
      case 'warning': return <AlertTriangle className="w-5 h-5" />;
      case 'critical': return <AlertTriangle className="w-5 h-5" />;
      default: return <Droplets className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Sustainable Extraction Quota */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Sustainable Extraction Planning</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Calendar className="w-5 h-5 text-blue-600 mr-2" />
              <span className="font-semibold text-blue-800">Current Month</span>
            </div>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full p-2 border border-blue-200 rounded bg-white text-blue-900 font-medium"
            >
              <option value="january">January</option>
              <option value="february">February</option>
              <option value="march">March</option>
              <option value="april">April</option>
              <option value="may">May</option>
            </select>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Droplets className="w-5 h-5 text-green-600 mr-2" />
              <span className="font-semibold text-green-800">Monthly Quota</span>
            </div>
            <div className="text-2xl font-bold text-green-700">
              {currentMonth.quota} ML
            </div>
            <div className="text-sm text-green-600">Million Liters</div>
          </div>

          <div className={`p-4 rounded-lg ${
            currentMonth.status === 'good' ? 'bg-green-50' :
            currentMonth.status === 'caution' ? 'bg-yellow-50' :
            currentMonth.status === 'warning' ? 'bg-orange-50' : 'bg-red-50'
          }`}>
            <div className="flex items-center mb-2">
              {getStatusIcon(currentMonth.status)}
              <span className="font-semibold ml-2 capitalize">{currentMonth.status} Status</span>
            </div>
            <div className="text-sm">
              {currentMonth.recommendation}
            </div>
          </div>
        </div>

        {/* Usage Progress */}
        {currentMonth.usage && (
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Current Usage: {currentMonth.usage} ML</span>
              <span>Remaining: {(currentMonth.quota - currentMonth.usage).toFixed(1)} ML</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-green-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(currentMonth.usage / currentMonth.quota) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Ideal Pumping Periods */}
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="font-semibold text-purple-800 mb-3 flex items-center">
            <Zap className="w-5 h-5 mr-2" />
            Ideal Pumping Strategy
          </h3>
          <p className="text-purple-700 mb-3">
            The aquifer is most resilient to pumping during <strong>Post-Monsoon months (Oct-Dec)</strong>. 
            Consider maximizing your water storage in this period to reduce summer extraction.
          </p>
          <div className="grid grid-cols-4 gap-2 text-center text-sm">
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(month => (
              <div
                key={month}
                className={`p-2 rounded ${
                  ['Oct', 'Nov', 'Dec'].includes(month)
                    ? 'bg-purple-200 text-purple-800 font-semibold'
                    : 'bg-white text-gray-600'
                }`}
              >
                {month}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recharge Zones */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Nearby Recharge Zones</h3>
        <div className="space-y-3">
          {rechargeZones.map((zone, index) => (
            <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div>
                <div className="font-medium text-gray-900">{zone.name}</div>
                <div className="text-sm text-gray-600">
                  {zone.distance} away • {zone.type} • {zone.potential} Potential
                </div>
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors">
                View Details
              </button>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 text-sm">
            <strong>Recommendation:</strong> Consider investing in artificial recharge structures 
            in high-potential zones to enhance local groundwater availability.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExtractionScheduler;