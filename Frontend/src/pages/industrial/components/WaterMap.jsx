// src/pages/industrial/components/WaterMap.jsx
import React from 'react';
import { MapPin, Navigation, Compass, Waves } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WaterMap = ({ location }) => {
  const navigate = useNavigate();
  // Realistic nearby monitoring stations around Tirupur, Tamil Nadu
  const nearbyStations = [
    { 
      id: 1, 
      name: 'Palladam DWLR Station', 
      distance: '8.2 km',
      waterLevel: 42.1, 
      status: 'safe',
      direction: 'NW',
      coordinates: { lat: 11.1485, lng: 77.2911 }
    },
    { 
      id: 2, 
      name: 'Kangayam Monitoring', 
      distance: '12.7 km',
      waterLevel: 47.8, 
      status: 'caution',
      direction: 'NE',
      coordinates: { lat: 11.1320, lng: 77.3950 }
    },
    { 
      id: 3, 
      name: 'Avinashi Groundwater', 
      distance: '15.3 km',
      waterLevel: 51.2, 
      status: 'critical',
      direction: 'SW',
      coordinates: { lat: 11.0850, lng: 77.2680 }
    },
    { 
      id: 4, 
      name: 'Perundurai Observation', 
      distance: '18.9 km',
      waterLevel: 38.5, 
      status: 'safe',
      direction: 'SE',
      coordinates: { lat: 11.0685, lng: 77.3880 }
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'safe': return 'bg-green-500 ring-green-200';
      case 'caution': return 'bg-yellow-500 ring-yellow-200';
      case 'critical': return 'bg-red-500 ring-red-200';
      default: return 'bg-gray-500 ring-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'safe': return 'Good';
      case 'caution': return 'Moderate';
      case 'critical': return 'Critical';
      default: return 'Unknown';
    }
  };

  // Calculate positions for stations around the facility
  const getStationPosition = (station, index) => {
    const positions = [
      { top: '20%', left: '70%' },  // NE
      { top: '60%', left: '80%' },  // SE  
      { top: '70%', left: '30%' },  // SW
      { top: '25%', left: '20%' },  // NW
    ];
    return positions[index % positions.length];
  };

  // Handle view all stations click
const handleViewAllStations = () => {
  navigate('/dashboard');
};

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">Location Overview</h2>
        <div className="flex items-center text-sm text-blue-600">
          <Compass className="w-4 h-4 mr-1" />
          Real-time Monitoring
        </div>
      </div>
      
      {/* Enhanced Map Container */}
      <div className="bg-gradient-to-br from-blue-50 to-cyan-100 rounded-lg h-80 relative mb-6 border-2 border-gray-200 overflow-hidden shadow-inner">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full" style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}></div>
        </div>

        {/* Map Center Marker - Industrial Facility */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="relative animate-pulse">
            <div className="absolute inset-0 bg-blue-600 rounded-full animate-ping opacity-20"></div>
            <MapPin className="w-10 h-10 text-blue-600 fill-current drop-shadow-lg" />
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-medium whitespace-nowrap shadow-lg border border-blue-700">
              Your Facility
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 w-2 h-2 bg-blue-600 rotate-45"></div>
            </div>
          </div>
        </div>

        {/* Connection Lines */}
        {nearbyStations.map((station, index) => {
          const position = getStationPosition(station, index);
          return (
            <div
              key={station.id}
              className="absolute top-1/2 left-1/2 w-px h-px bg-blue-300 opacity-40"
              style={{
                transform: `rotate(${index * 90}deg)`,
                width: '40%',
                transformOrigin: 'left center'
              }}
            ></div>
          );
        })}

        {/* Nearby Stations */}
        {nearbyStations.map((station, index) => {
          const position = getStationPosition(station, index);
          
          return (
            <div
              key={station.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 group cursor-pointer"
              style={position}
            >
              <div className="relative">
                {/* Station Marker */}
                <div 
                  className={`w-6 h-6 rounded-full ${getStatusColor(station.status)} border-2 border-white shadow-lg ring-2 transition-all duration-300 group-hover:scale-125 group-hover:ring-4`}
                >
                  <div className="absolute -top-8 -left-4 bg-gray-900 text-white px-2 py-1 rounded text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
                    <div className="font-semibold">{station.name}</div>
                    <div className="text-gray-300">{station.waterLevel}m • {station.distance}</div>
                  </div>
                </div>
                
                {/* Direction Indicator */}
                <div className="absolute -top-2 -right-2 bg-white border border-gray-300 rounded-full w-4 h-4 flex items-center justify-center text-xs font-bold text-gray-600">
                  {station.direction}
                </div>
              </div>
            </div>
          );
        })}

        {/* Map Legend */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-gray-200">
          <div className="text-xs font-semibold text-gray-700 mb-2">Status Legend</div>
          <div className="flex items-center space-x-3 text-xs">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
              <span className="text-gray-600">Good</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-1"></div>
              <span className="text-gray-600">Moderate</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
              <span className="text-gray-600">Critical</span>
            </div>
          </div>
        </div>

        {/* Scale Indicator */}
        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg border border-gray-200">
          <div className="flex items-center text-xs text-gray-600">
            <div className="w-16 h-px bg-gray-400 mr-2"></div>
            <span>10 km</span>
          </div>
        </div>
      </div>

      {/* Enhanced Station List */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-800 flex items-center">
          <Waves className="w-4 h-4 mr-2" />
          Nearby Monitoring Stations ({nearbyStations.length})
        </h3>
        
        <div className="grid grid-cols-1 gap-3">
          {nearbyStations.map(station => (
            <div 
              key={station.id} 
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors group cursor-pointer"
            >
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(station.status)}`}></div>
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-white border border-gray-300 rounded-full flex items-center justify-center">
                    <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                  </div>
                </div>
                
                <div>
                  <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                    {station.name}
                  </div>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <Navigation className="w-3 h-3 mr-1" />
                    {station.distance} • {station.direction}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className={`font-semibold ${
                  station.status === 'critical' ? 'text-red-600' :
                  station.status === 'caution' ? 'text-yellow-600' : 'text-green-600'
                }`}>
                  {station.waterLevel}m
                </div>
                <div className="text-xs text-gray-500 capitalize">
                  {getStatusText(station.status)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center">
            <Navigation className="w-4 h-4 mr-1" />
            Monitoring {nearbyStations.length} stations within 20km radius
          </div>
          <div className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">
            Updated: Just now
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-4 flex space-x-2">
        <button onClick={handleViewAllStations} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors text-sm font-medium">
          View All Stations
        </button>
        <button className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-sm">
          Export Data
        </button>
      </div>
    </div>
  );
};

export default WaterMap;