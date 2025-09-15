import React, { useState, useEffect, useRef } from 'react';
import { MapContainer as LeafletMap, TileLayer, CircleMarker, Popup, useMapEvents } from 'react-leaflet';

// Helper component to listen to map zoom events
function MapEvents({ setZoomLevel }) {
  useMapEvents({
    zoomend: (e) => setZoomLevel(e.target.getZoom()),
  });
  return null;
}

// Helper function to format the change data for display
const renderChange = (change, percentage) => {
  if (change === undefined || change === null) {
    return <p>Status: <span className="text-gray-500">No data</span></p>;
  }

  const isRise = change < 0;
  const color = isRise ? 'text-green-500' : 'text-red-500';
  const arrow = isRise ? '▲' : '▼';
  const label = isRise ? 'Rise' : 'Fall';
  
  return (
    <p className={`font-semibold ${color}`}>
      Status: {arrow} {label} by {Math.abs(change)}m ({Math.abs(percentage)}%)
    </p>
  );
};


export default function MapContainer({ stations, onMarkerClick, selectedStation }) {
  const initialZoom = 5;
  const position = [20.5937, 78.9629]; // Center of India
  const mapRef = useRef();
  const [currentZoom, setCurrentZoom] = useState(initialZoom);

  // Function to get dynamic radius based on zoom level
  const getRadius = (zoom) => {
    if (zoom <= 5) return 2;
    if (zoom <= 7) return 3;
    return 5;
  };

  // Effect to fly to a selected station on the map
  useEffect(() => {
    if (selectedStation && mapRef.current) {
      mapRef.current.flyTo([selectedStation.lat, selectedStation.lng], 12);
    }
  }, [selectedStation]);

  return (
    <LeafletMap
      ref={mapRef}
      center={position}
      zoom={initialZoom}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; OpenStreetMap &copy; CARTO'
      />
      <MapEvents setZoomLevel={setCurrentZoom} />
      
      {stations.map(station => (
        <CircleMarker
          key={station.id}
          center={[station.lat, station.lng]}
          radius={getRadius(currentZoom)}
          pathOptions={{ color: '#00f6ff', fillColor: '#00f6ff', fillOpacity: 0.7 }}
          eventHandlers={{
            click: () => onMarkerClick(station),
          }}
        >
          {/* --- THE FIX IS HERE --- */}
          <Popup>
            <div className="text-base font-sans">
              <h3 className="font-bold text-lg mb-1">{station.name || 'Unknown Location'}</h3>
              <p><strong className="font-semibold">ID:</strong> {station.id || 'N/A'}</p>
              <p><strong className="font-semibold">State:</strong> {station.state || 'N/A'}</p>
              {/* Call the helper function to render the groundwater level status */}
              {renderChange(station.change_mbgl, station.change_pct)}
            </div>
          </Popup>
          {/* ----------------------- */}
        </CircleMarker>
      ))}
    </LeafletMap>
  );
}
