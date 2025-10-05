// src/pages/industrial/components/KeyMetrics.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  AlertTriangle, 
  CheckCircle, 
  MapPin,
  Droplets,
  Calendar,
  Zap
} from 'lucide-react';

const KeyMetrics = ({ industryLocation }) => {
  const navigate = useNavigate();

  // Enhanced dummy data with industrial context
  const metrics = {
    currentWaterLevel: 45.2,
    trend: 'falling',
    status: 'caution',
    changeFromLastMonth: -2.1,
    nearestStations: 3,
    lastUpdated: '2 hours ago',
    availableWater: 15782, // ML
    aquiferType: 'Alluvial',
    specificYield: 0.137,
    area: 96, // km²
    minLevel: 12.52,
    waterSecurityScore: 72,
    monthlyQuota: 8.5,
    currentUsage: 6.8
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'safe': return 'text-green-600 bg-green-100 border-green-200';
      case 'caution': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'critical': return 'text-red-600 bg-red-100 border-red-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'safe': return <CheckCircle className="w-5 h-5" />;
      case 'caution': return <AlertTriangle className="w-5 h-5" />;
      case 'critical': return <AlertTriangle className="w-5 h-5" />;
      default: return <Minus className="w-5 h-5" />;
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'rising': return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'falling': return <TrendingDown className="w-5 h-5 text-red-600" />;
      default: return <Minus className="w-5 h-5 text-gray-600" />;
    }
  };

  const handleViewDetailedAnalysis = () => {
    // Navigate to detailed industrial analysis page
    navigate(`/industrial/site/${industryLocation.id || 'default'}`);
  };

  const calculateUsagePercentage = () => {
    return ((metrics.currentUsage / metrics.monthlyQuota) * 100).toFixed(1);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Header with Location */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Water Intelligence Dashboard</h2>
          <div className="flex items-center text-sm text-gray-600 mt-1">
            <MapPin className="w-4 h-4 mr-1" />
            {industryLocation.name} • {industryLocation.address}
          </div>
        </div>
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(metrics.status)}`}>
          {getStatusIcon(metrics.status)}
          <span className="ml-2 capitalize">{metrics.status}</span>
        </div>
      </div>
      
      {/* Main Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-gray-900">{metrics.currentWaterLevel}m</div>
            {getTrendIcon(metrics.trend)}
          </div>
          <div className="text-sm text-gray-600 mt-1">Current Water Level</div>
          <div className="text-xs text-gray-500 mt-1">
            {metrics.trend === 'falling' ? '↓' : '↑'} {Math.abs(metrics.changeFromLastMonth)}m from last month
          </div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="text-2xl font-bold text-gray-900">
            {metrics.availableWater.toLocaleString()} ML
          </div>
          <div className="text-sm text-gray-600 mt-1">Available Water</div>
          <div className="text-xs text-green-600 mt-1 flex items-center">
            <Droplets className="w-3 h-3 mr-1" />
            Real-time calculation
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <div className="text-2xl font-bold text-gray-900">{metrics.aquiferType}</div>
          <div className="text-sm text-gray-600 mt-1">Aquifer Type</div>
          <div className="text-xs text-gray-500 mt-1">
            Yield: {metrics.specificYield}
          </div>
        </div>

        <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
          <div className="text-2xl font-bold text-gray-900">{metrics.area} km²</div>
          <div className="text-sm text-gray-600 mt-1">Area of Influence</div>
          <div className="text-xs text-gray-500 mt-1">
            Monitoring zone
          </div>
        </div>
      </div>

      {/* Resource Calculation Card */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
          <Zap className="w-4 h-4 mr-2" />
          Resource Calculation
        </h3>
        <div className="bg-white rounded p-3 text-sm">
          <code className="text-gray-700">
            Available Water = (Current Level - Min Level) × Specific Yield × Area × 1000<br/>
            = ({metrics.currentWaterLevel}m - {metrics.minLevel}m) × {metrics.specificYield} × {metrics.area}km² × 1000<br/>
            = <strong className="text-green-600">{metrics.availableWater.toLocaleString()} Million Liters</strong>
          </code>
        </div>
      </div>

      {/* Usage Progress and Additional Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div>
          <h4 className="font-medium text-gray-700 mb-3 flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            Monthly Usage Progress
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Usage: {metrics.currentUsage} ML</span>
              <span>Quota: {metrics.monthlyQuota} ML</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  calculateUsagePercentage() > 90 ? 'bg-red-500' : 
                  calculateUsagePercentage() > 75 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(calculateUsagePercentage(), 100)}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-500">
              {calculateUsagePercentage()}% of monthly quota used
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-700 mb-3">Monitoring Info</h4>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Monitoring Stations:</span>
              <span className="font-medium">{metrics.nearestStations} nearby</span>
            </div>
            <div className="flex justify-between">
              <span>Water Security Score:</span>
              <span className="font-medium">{metrics.waterSecurityScore}/100</span>
            </div>
            <div className="flex justify-between">
              <span>Last Updated:</span>
              <span className="font-medium">{metrics.lastUpdated}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex space-x-3 pt-4 border-t border-gray-200">
        <button 
          onClick={handleViewDetailedAnalysis}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors text-sm font-medium flex items-center justify-center"
        >
          View Detailed Analysis
        </button>
        <button className="px-4 py-2 border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium">
          Set Alert
        </button>
      </div>
    </div>
  );
};

export default KeyMetrics;