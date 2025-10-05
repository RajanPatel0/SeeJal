// src/pages/industrial/IndustrialSiteDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Download, 
  Bell,
  MapPin,
  Droplets,
  Calendar,
  Zap,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Activity
} from 'lucide-react';

const IndustrialSiteDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [timeframe, setTimeframe] = useState('30days');
  const [siteData, setSiteData] = useState(null);

  // Mock data for industrial sites
  const industrialSites = {
    'TIRUPUR_TEXTILE_001': {
      id: 'TIRUPUR_TEXTILE_001',
      name: "Tirupur Textile Park",
      address: "Tirupur, Tamil Nadu",
      lat: 11.1085,
      lng: 77.3411,
      currentWaterLevel: 45.2,
      trend: 'falling',
      status: 'caution',
      availableWater: 15782,
      aquiferType: 'Alluvial',
      specificYield: 0.137,
      area: 96,
      minLevel: 12.52,
      waterSecurityScore: 72,
      lastUpdated: '2 hours ago',
      nearestStations: 3,
      monthlyQuota: 8.5,
      currentUsage: 6.8,
      industryType: 'Textile Manufacturing',
      dailyRequirement: 500000,
      employees: 1200,
      established: 2015
    },
    'default': {
      id: 'default',
      name: "Industrial Complex",
      address: "Industrial Area",
      lat: 12.9716,
      lng: 77.5946,
      currentWaterLevel: 38.7,
      trend: 'stable',
      status: 'safe',
      availableWater: 23456,
      aquiferType: 'Granite',
      specificYield: 0.089,
      area: 120,
      minLevel: 15.2,
      waterSecurityScore: 85,
      lastUpdated: '1 hour ago',
      nearestStations: 4,
      monthlyQuota: 12.0,
      currentUsage: 9.2,
      industryType: 'Mixed Industrial',
      dailyRequirement: 750000,
      employees: 2000,
      established: 2010
    }
  };

  useEffect(() => {
    // Simulate API call
    const site = industrialSites[id] || industrialSites.default;
    setSiteData(site);
  }, [id]);

  if (!siteData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading industrial site data...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'trends', label: 'Trend Analysis', icon: Activity },
    { id: 'industrial', label: 'Industrial Impact', icon: TrendingUp },
    { id: 'reports', label: 'Reports', icon: Download }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'safe': return 'text-green-600 bg-green-100 border-green-200';
      case 'caution': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'critical': return 'text-red-600 bg-red-100 border-red-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'rising': return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'falling': return <TrendingDown className="w-5 h-5 text-red-600" />;
      default: return <TrendingUp className="w-5 h-5 text-gray-600" />;
    }
  };

  // Mock chart data
  const waterLevelData = [
    { month: 'Jan', level: 42.1, forecast: null },
    { month: 'Feb', level: 43.2, forecast: null },
    { month: 'Mar', level: 44.5, forecast: 45.1 },
    { month: 'Apr', level: null, forecast: 47.2 },
    { month: 'May', level: null, forecast: 49.8 },
    { month: 'Jun', level: null, forecast: 52.3 },
  ];

  const rechargeData = [
    { month: 'Jan', rainfall: 15, recharge: 12 },
    { month: 'Feb', rainfall: 25, recharge: 20 },
    { month: 'Mar', rainfall: 40, recharge: 35 },
    { month: 'Apr', rainfall: 65, recharge: 55 },
    { month: 'May', rainfall: 45, recharge: 38 },
    { month: 'Jun', rainfall: 30, recharge: 25 },
  ];

  const WaterLevelChart = () => (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="font-semibold text-gray-800 mb-4">Water Level Trend & Forecast</h3>
      <div className="h-64 relative">
        {/* Simple bar chart representation */}
        <div className="flex items-end justify-between h-48 space-x-2">
          {waterLevelData.map((item, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              {item.level && (
                <div
                  className="w-full bg-blue-500 rounded-t transition-all duration-500 hover:bg-blue-600"
                  style={{ height: `${(item.level / 60) * 100}%` }}
                ></div>
              )}
              {item.forecast && (
                <div
                  className="w-full bg-purple-400 rounded-t opacity-70 border border-purple-300"
                  style={{ height: `${(item.forecast / 60) * 100}%` }}
                ></div>
              )}
              <div className="text-xs text-gray-600 mt-2">{item.month}</div>
            </div>
          ))}
        </div>
        <div className="flex justify-center space-x-4 mt-4 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded mr-1"></div>
            <span>Historical</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-purple-400 rounded mr-1"></div>
            <span>Forecast</span>
          </div>
        </div>
      </div>
    </div>
  );

  const RechargeChart = () => (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="font-semibold text-gray-800 mb-4">Rainfall & Recharge Analysis</h3>
      <div className="h-64">
        <div className="flex items-end justify-between h-48 space-x-2">
          {rechargeData.map((item, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div className="flex items-end w-full justify-center space-x-1">
                <div
                  className="w-1/2 bg-cyan-400 rounded-t opacity-80"
                  style={{ height: `${(item.rainfall / 100) * 100}%` }}
                ></div>
                <div
                  className="w-1/2 bg-green-500 rounded-t"
                  style={{ height: `${(item.recharge / 100) * 100}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-600 mt-2">{item.month}</div>
            </div>
          ))}
        </div>
        <div className="flex justify-center space-x-4 mt-4 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-cyan-400 rounded mr-1"></div>
            <span>Rainfall (mm)</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded mr-1"></div>
            <span>Recharge (ML)</span>
          </div>
        </div>
      </div>
    </div>
  );

  const calculateUsagePercentage = () => {
    return ((siteData.currentUsage / siteData.monthlyQuota) * 100).toFixed(1);
  };

  const calculateCostImpact = () => {
    const currentDepth = siteData.currentWaterLevel;
    const projectedDepth = siteData.trend === 'falling' ? currentDepth + 8 : currentDepth;
    const depthIncrease = projectedDepth - currentDepth;
    const costPerMeter = 0.5; // ₹0.5 per liter per additional meter
    const monthlyCostIncrease = (siteData.dailyRequirement * 30 * depthIncrease * costPerMeter) / 100000;
    
    return {
      depthIncrease,
      monthlyCostIncrease,
      percentageIncrease: ((monthlyCostIncrease / 15) * 100) // Assuming base cost of 15 lakhs
    };
  };

  const costImpact = calculateCostImpact();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/industrial')}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Dashboard
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{siteData.name}</h1>
                <div className="flex items-center text-sm text-gray-600 mt-1">
                  <MapPin className="w-4 h-4 mr-1" />
                  Industrial Site • {siteData.address} • {siteData.industryType}
                </div>
              </div>
            </div>
            <div className="flex space-x-3">
              <button className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                <Download className="w-4 h-4 mr-2" />
                Generate Report
              </button>
              <button className="flex items-center px-4 py-2 border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                <Bell className="w-4 h-4 mr-2" />
                Set Alert
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-gray-900">{siteData.currentWaterLevel}m</div>
              {getTrendIcon(siteData.trend)}
            </div>
            <div className="text-sm text-gray-600">Current Water Level</div>
            <div className={`text-xs mt-1 ${siteData.trend === 'falling' ? 'text-red-600' : 'text-green-600'}`}>
              {siteData.trend === 'falling' ? '↘ Decreasing' : '↗ Increasing'}
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-2xl font-bold text-gray-900">
              {siteData.availableWater.toLocaleString()} ML
            </div>
            <div className="text-sm text-gray-600">Available Water</div>
            <div className="text-xs mt-1 text-blue-600 flex items-center">
              <Droplets className="w-3 h-3 mr-1" />
              Calculated in real-time
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-2xl font-bold text-gray-900">{siteData.aquiferType}</div>
            <div className="text-sm text-gray-600">Aquifer Type</div>
            <div className="text-xs mt-1 text-gray-500">
              Specific Yield: {siteData.specificYield}
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-2xl font-bold text-gray-900">{siteData.area} km²</div>
            <div className="text-sm text-gray-600">Area of Influence</div>
            <div className="text-xs mt-1 text-gray-500">Monitoring zone</div>
          </div>
        </div>

        {/* Resource Calculation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
            <Zap className="w-5 h-5 mr-2" />
            Resource Calculation
          </h3>
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <code className="text-sm text-blue-800">
              Available Water = (Current Level - Min Level) × Specific Yield × Area × 1000<br/>
              = ({siteData.currentWaterLevel}m - {siteData.minLevel}m) × {siteData.specificYield} × {siteData.area}km² × 1000<br/>
              = <strong>{siteData.availableWater.toLocaleString()} Million Liters</strong>
            </code>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <nav className="flex space-x-8 px-6 border-b border-gray-200 overflow-x-auto">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <WaterLevelChart />
                  <RechargeChart />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-3">Water Security Status</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-blue-700">Security Score</span>
                      <div className="text-2xl font-bold text-blue-800">{siteData.waterSecurityScore}/100</div>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${siteData.waterSecurityScore}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-800 mb-3">Monthly Usage Progress</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-green-700">Usage: {siteData.currentUsage} ML / {siteData.monthlyQuota} ML</span>
                      <div className="text-lg font-bold text-green-800">{calculateUsagePercentage()}%</div>
                    </div>
                    <div className="w-full bg-green-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${calculateUsagePercentage()}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'trends' && (
              <div className="space-y-6">
                <div className="flex space-x-4 mb-6">
                  {['7days', '30days', '90days'].map(time => (
                    <button 
                      key={time}
                      onClick={() => setTimeframe(time)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        timeframe === time ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {time === '7days' ? '7 Days' : time === '30days' ? '30 Days' : '90 Days'}
                    </button>
                  ))}
                </div>
                <WaterLevelChart />
                <RechargeChart />
              </div>
            )}

            {activeTab === 'industrial' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                    <h4 className="font-semibold text-yellow-800 mb-3 flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-2" />
                      Pumping Cost Impact
                    </h4>
                    <p className="text-yellow-700 mb-3">
                      Current water level trend indicates a potential{' '}
                      <span className="font-bold">~{costImpact.percentageIncrease.toFixed(1)}% increase</span> in pumping costs over the next quarter.
                    </p>
                    <div className="text-sm text-yellow-600 space-y-1">
                      <p>Additional pumping depth: <span className="font-semibold">+{costImpact.depthIncrease.toFixed(1)}m</span></p>
                      <p>Estimated monthly cost increase: <span className="font-semibold">₹{costImpact.monthlyCostIncrease.toFixed(1)} lakhs</span></p>
                    </div>
                  </div>

                  <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Sustainable Usage
                    </h4>
                    <p className="text-green-700 mb-3">
                      Your current extraction is within sustainable limits. Current usage at {calculateUsagePercentage()}% of monthly quota.
                    </p>
                    <div className="text-sm text-green-600">
                      <p>Remaining quota: <span className="font-semibold">{(siteData.monthlyQuota - siteData.currentUsage).toFixed(1)} ML</span></p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-3">Industrial Recommendations</h4>
                  <ul className="text-blue-700 space-y-2">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      Implement water recycling to reduce fresh water dependency by 30%
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      Optimize pumping during high-water level periods (Oct-Dec)
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      Consider rainwater harvesting during monsoon season
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      Monitor competitor water usage in the area
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      Conduct monthly water audit to identify conservation opportunities
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'reports' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-800">Report Generation</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
                    <Download className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                    <h4 className="font-semibold text-gray-700">Monthly Water Report</h4>
                    <p className="text-sm text-gray-500 mt-1">Comprehensive monthly analysis</p>
                  </div>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors cursor-pointer">
                    <Activity className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                    <h4 className="font-semibold text-gray-700">Sustainability Report</h4>
                    <p className="text-sm text-gray-500 mt-1">Environmental impact assessment</p>
                  </div>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-500 transition-colors cursor-pointer">
                    <TrendingUp className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                    <h4 className="font-semibold text-gray-700">Forecast Report</h4>
                    <p className="text-sm text-gray-500 mt-1">6-month water level predictions</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Site Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Industrial Site Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Site Details</h4>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-gray-600">Site ID</dt>
                  <dd className="font-medium">{siteData.id}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Location</dt>
                  <dd className="font-medium">{siteData.address}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Industry Type</dt>
                  <dd className="font-medium">{siteData.industryType}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Established</dt>
                  <dd className="font-medium">{siteData.established}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Employees</dt>
                  <dd className="font-medium">{siteData.employees}</dd>
                </div>
              </dl>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Technical Details</h4>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-gray-600">Aquifer Type</dt>
                  <dd className="font-medium">{siteData.aquiferType}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Specific Yield</dt>
                  <dd className="font-medium">{siteData.specificYield}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Daily Water Requirement</dt>
                  <dd className="font-medium">{(siteData.dailyRequirement / 1000).toLocaleString()} KL</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Monitoring Stations</dt>
                  <dd className="font-medium">{siteData.nearestStations} nearby</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Last Updated</dt>
                  <dd className="font-medium">{siteData.lastUpdated}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndustrialSiteDetail;