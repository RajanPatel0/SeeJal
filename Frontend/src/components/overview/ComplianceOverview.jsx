import React, { useMemo } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { mockStations } from "../../utils/mockData";

const ComplianceOverview = () => {
  const complianceData = useMemo(() => {
    const grouped = {};
    mockStations.forEach((s) => {
      if (!grouped[s.state])
        grouped[s.state] = { total: 0, monitored: 0, lowFreq: 0 };
      grouped[s.state].total++;

      // Simulate compliance data
      if (Math.random() > 0.1) grouped[s.state].monitored++;
      else grouped[s.state].lowFreq++;
    });

    return grouped;
  }, []);

  const states = Object.keys(complianceData);
  const avgCoverage =
    Object.values(complianceData).reduce(
      (sum, s) => sum + (s.monitored / s.total) * 100,
      0
    ) / states.length;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h2 className="text-2xl font-semibold mb-4">✅ Compliance Overview</h2>
      <p className="text-gray-600 mb-4">
        Monitor data coverage, station compliance, and identify blind spots.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Map */}
        <div className="h-96">
          <MapContainer
            center={[22.97, 78.65]}
            zoom={5}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; OpenStreetMap'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {mockStations.map((station, i) => (
              <CircleMarker
                key={i}
                center={[station.lat, station.lng]}

                radius={5}
                color={Math.random() > 0.1 ? "green" : "red"}
              >
                <Tooltip>
                  <strong>{station.name}</strong>
                  <br />
                  {Math.random() > 0.1 ? "Compliant" : "Missing Data"}
                </Tooltip>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>

        {/* Summary */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-dark mb-3">Coverage Summary</h3>
          <p className="text-gray-700 mb-2">
            Average Monitoring Coverage:{" "}
            <span className="font-bold text-blue-600">
              {avgCoverage.toFixed(1)}%
            </span>
          </p>
          <table className="w-full text-sm mt-3">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">State</th>
                <th className="text-right py-2">Coverage (%)</th>
                <th className="text-right py-2">Low-Frequency Stations</th>
              </tr>
            </thead>
            <tbody>
              {states.map((state, i) => {
                const data = complianceData[state];
                const coverage = (data.monitored / data.total) * 100;
                return (
                  <tr key={i} className="border-b">
                    <td className="py-2">{state}</td>
                    <td
                      className={`text-right py-2 ${
                        coverage < 70
                          ? "text-red-600"
                          : coverage < 85
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}
                    >
                      {coverage.toFixed(1)}
                    </td>
                    <td className="text-right py-2">{data.lowFreq}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ComplianceOverview;
