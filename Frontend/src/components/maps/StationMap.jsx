import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { mockStations } from "../../utils/mockData";

// Define India bounds for map constraints
const indiaBounds = [
  [6.0, 68.0], // Southwest coordinates
  [35.0, 97.0], // Northeast coordinates
];

// Map bounds controller component
const MapBoundsController = () => {
  const map = useMap();

  useEffect(() => {
    // Set max bounds for India
    map.setMaxBounds(indiaBounds);

    // Optional: Set minimum zoom level
    map.setMinZoom(3);

    // Optional: Set maximum zoom level
    map.setMaxZoom(12);
  }, [map]);

  return null;
};

// Function to create custom marker icons based on station status
const getMarkerIcon = (status) => {
  const iconColor =
    status === "safe"
      ? "#10B981"
      : status === "semi-critical"
      ? "#F59E0B"
      : "#EF4444";

  return L.divIcon({
    html: `
      <div style="
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background-color: ${iconColor};
        border: 3px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: bold;
        color: white;
      ">
        ${status === "critical" ? "!" : status === "semi-critical" ? "⚠" : "✓"}
      </div>
    `,
    className: "custom-station-marker",
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

// Accept props for filtering
const StationMap = ({
  onStationSelect,
  selectedStation,
  filters = { state: "all", status: "all" },
  stations = mockStations,
}) => {
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
  const stationsWithinIndia = stations.filter(
    (station) =>
      station.lat >= 6.0 &&
      station.lat <= 35.0 &&
      station.lng >= 68.0 &&
      station.lng <= 97.0
  );

  const handleStationClick = (stationId) => {
    if (onStationSelect) {
      const station = stationsWithinIndia.find((s) => s.id === stationId);
      onStationSelect(station);
    } else {
      navigate(`/station/${stationId}`);
    }
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

        {/* Political Map Tile Layer */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
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
