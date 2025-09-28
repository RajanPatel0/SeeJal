import React from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { mockStations } from "../../utils/mockData";

// India bounds to restrict map view
const indiaBounds = [
  [6.0, 68.0], // Southwest coordinates (Kanyakumari to Gujarat)
  [35.0, 97.0]  // Northeast coordinates (Kashmir to Arunachal)
];

// Bounds controller component
const MapBoundsController = () => {
  const map = useMap();
  
  React.useEffect(() => {
    // Set max bounds to India
    map.setMaxBounds(indiaBounds);
    
    // Ensure initial view is within India
    if (!map.getBounds().intersects(indiaBounds)) {
      map.fitBounds(indiaBounds);
    }
  }, [map]);

  return null;
};

// Create simple colored dot icons
const createDotIcon = (color) => {
  return L.divIcon({
    className: 'custom-dot-marker',
    html: `<div style="
      background-color: ${color};
      width: 12px;
      height: 12px;
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      cursor: pointer;
    "></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
    popupAnchor: [0, -6],
  });
};

// Define colored dot icons
const dotIcons = {
  green: createDotIcon('#10B981'),  // Safe - Green
  orange: createDotIcon('#F59E0B'), // Semi-critical - Orange
  red: createDotIcon('#EF4444'),    // Critical - Red
  blue: createDotIcon('#3B82F6'),   // Default - Blue
};

// Get marker icon by station status
const getMarkerIcon = (status) => {
  switch (status) {
    case "safe":
      return dotIcons.green;
    case "semi-critical":
      return dotIcons.orange;
    case "critical":
      return dotIcons.red;
    default:
      return dotIcons.blue;
  }
};

const StationMap = () => {
  const navigate = useNavigate();

  // Filter stations to ensure they're within India bounds
  const stationsWithinIndia = mockStations.filter(station => 
    station.lat >= 6.0 && station.lat <= 35.0 && 
    station.lng >= 68.0 && station.lng <= 97.0
  );

  const handleStationClick = (stationId) => {
    navigate(`/station/${stationId}`);
  };

  
// In the return statement of your StationMap component, update the container div:
return (
    <div style={{ 
        height: "100vh", 
        width: "100%",
        position: 'relative' // Add this
    }}>
      <MapContainer
        center={[22.9734, 78.6569]}
        zoom={5}
        style={{ 
            height: "100%", 
            width: "100%",
            cursor: 'grab' // Visual cue for draggable map
        }}
        scrollWheelZoom={true}
        minZoom={4}
        maxZoom={12}
        maxBounds={indiaBounds}
        maxBoundsViscosity={1.0} // Strict bounds enforcement
      >
        <MapBoundsController />
        
        {/* OpenStreetMap Tile Layer */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
          bounds={indiaBounds}
        />

        {/* Station Markers */}
        {stationsWithinIndia.map((station) => (
          <Marker
            key={station.id}
            position={[station.lat, station.lng]}
            icon={getMarkerIcon(station.status)}
          >
            <Popup>
              <div style={{ minWidth: "200px" }}>
                <h3 style={{ margin: "0 0 8px 0", fontSize: "16px", color: "#1f2937" }}>
                  {station.name}
                </h3>
                <div style={{ margin: "4px 0", fontSize: "14px", lineHeight: "1.4" }}>
                  <p><strong>Station ID:</strong> {station.id}</p>
                  <p><strong>Location:</strong> {station.district}, {station.state}</p>
                  <p><strong>Water Level:</strong> {station.currentLevel}m</p>
                  <p><strong>Trend:</strong> 
                    <span style={{ 
                      color: station.trend === "increasing" ? "#10B981" : "#EF4444",
                      fontWeight: "bold",
                      marginLeft: "4px"
                    }}>
                      {station.trend === "increasing" ? "↑ Increasing" : "↓ Decreasing"}
                    </span>
                  </p>
                  <p><strong>Status:</strong> 
                    <span style={{
                      color: station.status === "safe" ? "#10B981" : 
                             station.status === "semi-critical" ? "#F59E0B" : "#EF4444",
                      fontWeight: "bold",
                      marginLeft: "4px"
                    }}>
                      {station.status === "safe" ? "Good" : 
                       station.status === "semi-critical" ? "Moderate" : "Critical"}
                    </span>
                  </p>
                </div>
                <button
                  onClick={() => handleStationClick(station.id)}
                  style={{
                    width: "100%",
                    marginTop: "12px",
                    padding: "8px 12px",
                    backgroundColor: "#2563eb",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "500",
                    transition: "background-color 0.2s"
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = "#1d4ed8"}
                  onMouseLeave={(e) => e.target.style.backgroundColor = "#2563eb"}
                >
                  View Detailed Analysis
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default StationMap;