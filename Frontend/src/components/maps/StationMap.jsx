import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { mockStations } from "../../utils/mockData";

// India bounds to restrict map view
const indiaBounds = [
  [6.0, 68.0], // Southwest coordinates (Kanyakumari to Gujarat)
  [35.0, 97.0], // Northeast coordinates (Kashmir to Arunachal)
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

// Create responsive colored dot icons
const createDotIcon = (color) => {
  return L.divIcon({
    className: "custom-dot-marker",
    html: `<div style="
      background-color: ${color};
      width: 14px;
      height: 14px;
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      cursor: pointer;
    "></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
    popupAnchor: [0, -7],
  });
};

// Define colored dot icons
const dotIcons = {
  green: createDotIcon("#10B981"), // Safe - Green
  orange: createDotIcon("#F59E0B"), // Semi-critical - Orange
  red: createDotIcon("#EF4444"), // Critical - Red
  blue: createDotIcon("#3B82F6"), // Default - Blue
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
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Filter stations to ensure they're within India bounds
  const stationsWithinIndia = mockStations.filter(
    (station) =>
      station.lat >= 6.0 &&
      station.lat <= 35.0 &&
      station.lng >= 68.0 &&
      station.lng <= 97.0
  );

  const handleStationClick = (stationId) => {
    navigate(`/station/${stationId}`);
  };

  // In the return statement of your StationMap component, update the container div:
  return (
    <div
      className="station-map-container"
      style={{
        height: "100%",
        width: "100%",
        position: "relative",
        minHeight: isMobile ? "350px" : "400px",
        borderRadius: "12px",
        boxShadow:
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      }}
    >
      <MapContainer
        center={[22.9734, 78.6569]}
        zoom={isMobile ? 4 : 5}
        style={{
          height: "100%",
          width: "100%",
        }}
        scrollWheelZoom={true}
        dragging={true}
        touchZoom={true}
        doubleClickZoom={true}
        boxZoom={true}
        keyboard={true}
        minZoom={3}
        maxZoom={12}
        maxBounds={indiaBounds}
        maxBoundsViscosity={0.8}
        zoomControl={true}
        attributionControl={true}
        tap={true}
        tapTolerance={15}
      >
        <MapBoundsController />

        {/* Soil Terrain Tile Layer */}
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
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
              <div
                className="station-popup"
                style={{
                  minWidth: isMobile ? "160px" : "200px",
                  maxWidth: isMobile ? "250px" : "300px",
                  zIndex: 1000,
                }}
              >
                <h3
                  style={{
                    margin: "0 0 8px 0",
                    fontSize: isMobile ? "14px" : "16px",
                    color: "#1f2937",
                    fontWeight: "600",
                  }}
                >
                  {station.name}
                </h3>
                <div
                  style={{
                    margin: "4px 0",
                    fontSize: isMobile ? "12px" : "14px",
                    lineHeight: "1.4",
                  }}
                >
                  <p style={{ margin: "2px 0" }}>
                    <strong>Station ID:</strong> {station.id}
                  </p>
                  <p style={{ margin: "2px 0" }}>
                    <strong>Location:</strong> {station.district},{" "}
                    {station.state}
                  </p>
                  <p style={{ margin: "2px 0" }}>
                    <strong>Water Level:</strong> {station.currentLevel}m
                  </p>
                  <p style={{ margin: "2px 0" }}>
                    <strong>Trend:</strong>
                    <span
                      style={{
                        color:
                          station.trend === "increasing"
                            ? "#10B981"
                            : "#EF4444",
                        fontWeight: "bold",
                        marginLeft: "4px",
                      }}
                    >
                      {station.trend === "increasing" ? "↗" : "↘"}
                    </span>
                  </p>
                  <p style={{ margin: "2px 0" }}>
                    <strong>Status:</strong>
                    <span
                      style={{
                        color:
                          station.status === "safe"
                            ? "#10B981"
                            : station.status === "semi-critical"
                            ? "#F59E0B"
                            : "#EF4444",
                        fontWeight: "bold",
                        marginLeft: "4px",
                        fontSize: isMobile ? "11px" : "12px",
                      }}
                    >
                      {station.status === "safe"
                        ? "🟢 Good"
                        : station.status === "semi-critical"
                        ? "🟡 Moderate"
                        : "🔴 Critical"}
                    </span>
                  </p>
                </div>
                <button
                  onClick={() => handleStationClick(station.id)}
                  style={{
                    width: "100%",
                    marginTop: "10px",
                    padding: isMobile ? "6px 10px" : "8px 12px",
                    backgroundColor: "#8b4513",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: isMobile ? "12px" : "14px",
                    fontWeight: "500",
                    transition: "background-color 0.2s",
                    minHeight: isMobile ? "32px" : "36px",
                  }}
                  onMouseEnter={(e) => {
                    if (!isMobile) {
                      e.target.style.backgroundColor = "#a0522d";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isMobile) {
                      e.target.style.backgroundColor = "#8b4513";
                    }
                  }}
                  onTouchStart={(e) => {
                    e.target.style.backgroundColor = "#a0522d";
                  }}
                  onTouchEnd={(e) => {
                    e.target.style.backgroundColor = "#8b4513";
                  }}
                >
                  {isMobile ? "View Details" : "View Detailed Analysis"}
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
