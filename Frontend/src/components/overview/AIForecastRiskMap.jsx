import React from "react";
import { MapContainer, TileLayer, Circle, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { mockStations } from "../../utils/mockData";

const AIForecastRiskMap = () => {
  // Map station status to risk levels
  const getRisk = (status) => {
    if (status === "critical") return "High";
    if (status === "semi-critical") return "Medium";
    return "Low";
  };

  const getColor = (risk) => {
    if (risk === "High") return "red";
    if (risk === "Medium") return "orange";
    return "green";
  };

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-semibold text-dark mb-4">AI Forecast Risk Map</h2>
      <p className="text-gray-600 mb-4">
        AI-driven map predicting groundwater stress, contamination risks, and potential hazards.
      </p>

      <MapContainer
        style={{ height: "400px", width: "100%" }}
        center={[22.5937, 78.9629]} // center of India
        zoom={5}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {mockStations.map((station) => {
          const risk = getRisk(station.status);
          return (
            <Circle
              key={station.id}
              center={[station.lat, station.lng]}
              radius={20000} // can be adjusted based on severity
              pathOptions={{ color: getColor(risk) }}
            >
              <Popup>
                {station.district}, {station.state} <br />
                Status: {station.status} <br />
                Risk Level: {risk} <br />
                Current Level: {station.currentLevel} m
              </Popup>
            </Circle>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default AIForecastRiskMap;
