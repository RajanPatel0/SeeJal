
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import WaterLevelChart from '../components/charts/WaterLevelChart';
import RechargeChart from '../components/charts/RechargeChart';
import ForecastChart from '../components/charts/ForecastChart';
import StatusIndicator from '../components/common/StatusIndicator';
import { mockStations, getStationById } from '../utils/mockData';

const StationDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [station, setStation] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [timeframe, setTimeframe] = useState('30days');

  useEffect(() => {
    console.log('Looking for station ID:', id); // Debug log
    const foundStation = getStationById(id);
    console.log('Found station:', foundStation); // Debug log
    
    if (foundStation) {
      setStation(foundStation);
    } else {
      console.error('Station not found, redirecting to dashboard');
      navigate('/dashboard');
    }
  }, [id, navigate]);

  if (!station) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading station data...</p>
        </div>
      </div>
    );
  }

  // Calculate available water
  const availableWater = ((station.currentLevel - station.minLevel) * station.specificYield * station.area * 1000).toFixed(0);

  // Generate forecast data
  const generateForecast = () => {
    const lastValue = station.data[station.data.length - 1]?.level || station.currentLevel;
    const forecast = [];
    for (let i = 1; i <= 15; i++) {
      const change = station.trend === 'increasing' ? -0.1 : 0.1;
      forecast.push(lastValue + change * i);
    }
    return forecast;
  };

  const forecastData = generateForecast();

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'trends', label: 'Trend Analysis' },
    { id: 'recharge', label: 'Recharge Events' },
    { id: 'forecast', label: 'AI Forecast' }
  ];

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-primary hover:text-blue-700 mb-4 transition-colors"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
          
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
            <div>
              <h1 className="text-3xl font-bold text-dark mb-2">{station.name}</h1>
              <div className="flex items-center space-x-4 text-gray-600">
                <span>Station ID: {station.id}</span>
                <span>•</span>
                <span>{station.district}, {station.state}</span>
                <span>•</span>
                <StatusIndicator status={station.status} />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-4 lg:mt-0">
              <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors">
                {t('generate_report')}
              </button>
              <button className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-blue-50 transition-colors">
                {t('set_alert')}
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-2xl font-bold text-dark mb-1">{station.currentLevel}m</div>
            <div className="text-sm text-gray-600">{t('current_level')}</div>
            <div className={`text-xs mt-1 ${station.trend === 'increasing' ? 'text-green-600' : 'text-red-600'}`}>
              {station.trend === 'increasing' ? '↗ Increasing' : '↘ Decreasing'}
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-2xl font-bold text-dark mb-1">{availableWater} ML</div>
            <div className="text-sm text-gray-600">{t('available_water')}</div>
            <div className="text-xs mt-1 text-blue-600">Calculated in real-time</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-2xl font-bold text-dark mb-1">{station.aquiferType}</div>
            <div className="text-sm text-gray-600">{t('aquifer_type')}</div>
            <div className="text-xs mt-1 text-gray-500">Specific Yield: {station.specificYield}</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-2xl font-bold text-dark mb-1">{station.area} km²</div>
            <div className="text-sm text-gray-600">Area of Influence</div>
            <div className="text-xs mt-1 text-gray-500">Monitoring zone</div>
          </div>
        </div>

        {/* Resource Calculation Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="font-semibold text-dark mb-4">{t('resource_calculation')}</h3>
          <div className="bg-blue-50 rounded-lg p-4">
            <code className="text-sm text-blue-800">
              Available Water = (Current Level - Min Level) × Specific Yield × Area × 1000<br/>
              = ({station.currentLevel}m - {station.minLevel}m) × {station.specificYield} × {station.area}km² × 1000<br/>
              = <strong>{availableWater} Million Liters</strong>
            </code>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mb-8">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <WaterLevelChart data={station.data} timeframe={timeframe} />
              <RechargeChart data={station.data} />
            </div>
          )}

          {activeTab === 'trends' && (
            <div className="space-y-6">
              <div className="flex space-x-4">
                <button 
                  onClick={() => setTimeframe('7days')}
                  className={`px-4 py-2 rounded-lg ${
                    timeframe === '7days' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  7 Days
                </button>
                <button 
                  onClick={() => setTimeframe('30days')}
                  className={`px-4 py-2 rounded-lg ${
                    timeframe === '30days' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  30 Days
                </button>
                <button 
                  onClick={() => setTimeframe('90days')}
                  className={`px-4 py-2 rounded-lg ${
                    timeframe === '90days' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  90 Days
                </button>
              </div>
              <WaterLevelChart data={station.data} timeframe={timeframe} />
            </div>
          )}

          {activeTab === 'recharge' && (
            <RechargeChart data={station.data} />
          )}

          {activeTab === 'forecast' && (
            <ForecastChart historicalData={station.data} forecastData={forecastData} />
          )}
        </div>

        {/* Station Metadata */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="font-semibold text-dark mb-4">Station Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Basic Details</h4>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-gray-600">Station ID</dt>
                  <dd className="font-medium">{station.id}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Location</dt>
                  <dd className="font-medium">{station.district}, {station.state}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Coordinates</dt>
                  <dd className="font-medium">{station.lat.toFixed(4)}, {station.lng.toFixed(4)}</dd>
                </div>
              </dl>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Technical Details</h4>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-gray-600">Aquifer Type</dt>
                  <dd className="font-medium">{station.aquiferType}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Specific Yield</dt>
                  <dd className="font-medium">{station.specificYield}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Last Updated</dt>
                  <dd className="font-medium">{new Date(station.lastUpdated).toLocaleString()}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StationDetail;