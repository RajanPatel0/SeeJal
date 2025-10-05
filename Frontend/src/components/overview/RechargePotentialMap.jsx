import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { mockStations } from "../../utils/mockData";

const RechargePotentialMap = () => {
  // Use only stations that are safe (good for recharge)
  const rechargePoints = mockStations.filter((s) => s.status === "safe");

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-semibold text-dark mb-4">Recharge Potential Map</h2>
      <p className="text-gray-600 mb-4">
        Interactive map highlighting stations with high potential for groundwater recharge.
      </p>

      <MapContainer
        style={{ height: "400px", width: "100%" }}
        center={[22.5937, 78.9629]} // center of India
        zoom={5}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {rechargePoints.map((point) => (
          <Marker key={point.id} position={[point.lat, point.lng]}>
            <Popup>
              {point.district}, {point.state} <br /> Current Level: {point.currentLevel} m
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default RechargePotentialMap;
