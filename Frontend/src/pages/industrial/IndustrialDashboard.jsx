// src/pages/industrial/IndustrialDashboard.jsx
import React, { useState } from 'react';
import { 
  TrendingUp, 
  AlertTriangle, 
  Calendar,
  MapPin,
  Download,
  BarChart3
} from 'lucide-react';
import KeyMetrics from './components/KeyMetrics';
import WaterMap from './components/WaterMap';
import PredictiveForecast from './components/PredictiveForecast';
import ExtractionScheduler from './components/ExtractionScheduler';
import AlertsSystem from './components/AlertsSystem';
import WaterLevelChart from './components/WaterLevelChart';
import IndustrialReports from './components/IndustrialReports';

const IndustrialDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [industryLocation, setIndustryLocation] = useState({
    id: 'TIRUPUR_TEXTILE_001',
    name: "Tirupur Textile Park",
    lat: 11.1085,
    lng: 77.3411,
    address: "Tirupur, Tamil Nadu"
  });

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'forecast', name: 'Forecast', icon: TrendingUp },
    { id: 'scheduler', name: 'Extraction Plan', icon: Calendar },
    { id: 'alerts', name: 'Alerts', icon: AlertTriangle },
    { id: 'reports', name: 'Reports', icon: Download }
  ];

  const handleGenerateReport = () => {
    // Switch to reports tab and trigger generation
    setActiveTab('reports');
    // You can add additional logic here if needed
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <KeyMetrics industryLocation={industryLocation} />
              <WaterMap location={industryLocation} />
            </div>
            <WaterLevelChart />
          </div>
        );
      case 'forecast':
        return <PredictiveForecast location={industryLocation} />;
      case 'scheduler':
        return <ExtractionScheduler location={industryLocation} />;
      case 'alerts':
        return <AlertsSystem location={industryLocation} />;
      case 'reports':
        return <IndustrialReports location={industryLocation} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Industrial Water Intelligence</h1>
              <div className="flex items-center text-sm text-gray-600 mt-1">
                <MapPin className="w-4 h-4 mr-1" />
                {industryLocation.name} • {industryLocation.address}
              </div>
            </div>
            <button 
              onClick={handleGenerateReport}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors font-medium flex items-center"
            >
              <Download className="w-5 h-5 mr-2" />
              Generate Report
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
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
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default IndustrialDashboard;