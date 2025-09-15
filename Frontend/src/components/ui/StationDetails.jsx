import React, { useState, useEffect } from 'react';
import DataChart from '../charts/DataChart';

const statusStyles = {
  active: 'text-green-700 bg-green-100',
  inactive: 'text-red-700 bg-red-100',
  maintenance: 'text-yellow-700 bg-yellow-100',
};

export default function StationDetails({ station, onClose }) {
  const [timeSeries, setTimeSeries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!station) return;
    setLoading(true);
    fetch('/data/timeseries_data.json')
      .then(res => res.json())
      .then(data => {
        setTimeSeries(data[station.id] || []);
        setLoading(false);
      });
  }, [station]);

  if (!station) return null;

  return (
    <div className="mt-4 border-t pt-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold">{station.name}</h2>
        <button onClick={onClose} className="text-2xl text-gray-500 hover:text-gray-800">&times;</button>
      </div>
      <div className="space-y-1 text-sm text-gray-600">
        <p><strong>District:</strong> {station.district}</p>
        <p><strong>State:</strong> {station.state}</p>
        <p>
          <strong>Status:</strong> 
          <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${statusStyles[station.status]}`}>
            {station.status.charAt(0).toUpperCase() + station.status.slice(1)}
          </span>
        </p>
      </div>
      
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Groundwater Level Trend</h3>
        {loading ? (
          <p>Loading chart data...</p>
        ) : (
          <div className="w-full h-48">
            <DataChart data={timeSeries} />
          </div>
        )}
      </div>
    </div>
  );
}
