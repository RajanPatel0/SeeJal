import React from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { mockStations } from "../../utils/mockData";

const RiskHeatmap = () => {
  const getColor = (status) => {
    switch (status) {
      case "safe": return "green";
      case "semi-critical": return "yellow";
      case "critical": return "orange";
      case "over-exploited": return "red";
      default: return "gray";
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h2 className="text-2xl font-semibold mb-4">🗺 Risk Heatmap</h2>
      <p className="text-gray-600 mb-4">Visualize district-level groundwater risk status.</p>

      <div className="h-96 rounded-lg overflow-hidden">
        <MapContainer center={[22.97, 78.65]} zoom={5} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {mockStations.map((station, i) => (
            <CircleMarker
              key={i}
              center={[station.lat, station.lng]}

              radius={6}
              fillOpacity={0.8}
              color={getColor(station.status)}
            >
              <Tooltip>
                <div>
                  <strong>{station.name}</strong><br />
                  Status: {station.status}<br />
                  Level: {station.currentLevel}m
                </div>
              </Tooltip>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default RiskHeatmap;
