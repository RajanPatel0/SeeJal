// src/pages/industrial/components/AlertsSystem.jsx
import React, { useState } from 'react';
import { Bell, AlertTriangle, Info, CheckCircle, Settings } from 'lucide-react';

const AlertsSystem = ({ location }) => {
  const [alertSettings, setAlertSettings] = useState({
    criticalLevel: 50,
    cautionLevel: 40,
    rainfallAlert: true,
    competitorAlert: true,
    monthlyReport: true
  });

  // Dummy alerts data
  const alerts = [
    {
      id: 1,
      type: 'critical',
      title: 'Critical Water Level Alert',
      message: 'Water level at nearest station (Station C) has dropped to CRITICAL level (51.2m). Voluntary reduction of extraction is advised.',
      timestamp: '2 hours ago',
      read: false
    },
    {
      id: 2,
      type: 'info',
      title: 'Monsoon Season Approaching',
      message: 'The monsoon season begins next month. Water levels are expected to rise. Your rainwater harvesting structures should be operational.',
      timestamp: '1 day ago',
      read: true
    },
    {
      id: 3,
      type: 'warning',
      title: 'New Industrial License Granted',
      message: 'A new industrial license has been granted within a 5km radius. Monitor your water levels closely for potential impact.',
      timestamp: '3 days ago',
      read: true
    },
    {
      id: 4,
      type: 'success',
      title: 'Monthly Water Report Ready',
      message: 'Your monthly water usage and sustainability report for January is now available for download.',
      timestamp: '1 week ago',
      read: true
    }
  ];

  const getAlertIcon = (type) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'info': return <Info className="w-5 h-5 text-blue-600" />;
      case 'success': return <CheckCircle className="w-5 h-5 text-green-600" />;
      default: return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getAlertBorder = (type) => {
    switch (type) {
      case 'critical': return 'border-l-red-500';
      case 'warning': return 'border-l-yellow-500';
      case 'info': return 'border-l-blue-500';
      case 'success': return 'border-l-green-500';
      default: return 'border-l-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Alerts List */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Alerts & Notifications</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              {alerts.filter(alert => !alert.read).length} unread
            </span>
            <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {alerts.map(alert => (
            <div
              key={alert.id}
              className={`p-4 border-l-4 ${getAlertBorder(alert.type)} bg-gray-50 rounded-r-lg transition-all hover:bg-gray-100 ${
                !alert.read ? 'border-2 border-blue-200 bg-blue-50' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                {getAlertIcon(alert.type)}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">{alert.title}</h3>
                    <span className="text-sm text-gray-500">{alert.timestamp}</span>
                  </div>
                  <p className="text-gray-600 mt-1">{alert.message}</p>
                  <div className="mt-2 flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      View Details
                    </button>
                    {!alert.read && (
                      <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                        Mark as Read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alert Settings */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Alert Preferences</h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Critical Water Level (meters)
              </label>
              <input
                type="number"
                value={alertSettings.criticalLevel}
                onChange={(e) => setAlertSettings({...alertSettings, criticalLevel: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Caution Water Level (meters)
              </label>
              <input
                type="number"
                value={alertSettings.cautionLevel}
                onChange={(e) => setAlertSettings({...alertSettings, cautionLevel: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={alertSettings.rainfallAlert}
                onChange={(e) => setAlertSettings({...alertSettings, rainfallAlert: e.target.checked})}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Send rainfall and recharge alerts</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={alertSettings.competitorAlert}
                onChange={(e) => setAlertSettings({...alertSettings, competitorAlert: e.target.checked})}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Alert about new industrial licenses in area</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={alertSettings.monthlyReport}
                onChange={(e) => setAlertSettings({...alertSettings, monthlyReport: e.target.checked})}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Send monthly water usage reports</span>
            </label>
          </div>

          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
            Save Preferences
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors text-center">
            <Bell className="w-6 h-6 mx-auto mb-2" />
            <div className="font-medium">Test Alert System</div>
          </button>
          
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-green-500 hover:text-green-600 transition-colors text-center">
            <CheckCircle className="w-6 h-6 mx-auto mb-2" />
            <div className="font-medium">Mark All as Read</div>
          </button>
          
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-purple-500 hover:text-purple-600 transition-colors text-center">
            <Settings className="w-6 h-6 mx-auto mb-2" />
            <div className="font-medium">Notification Settings</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertsSystem;