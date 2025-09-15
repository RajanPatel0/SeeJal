import React, { useState, useMemo } from 'react';
import { useLocalData } from '../hooks/useLocalData';
import LeftSidebar from '../components/layout/LeftSidebar';
import RightSidebar from '../components/layout/RightSidebar';
import MapContainer from '../components/map/MapContainer';
import Papa from 'papaparse';
import { getDistance } from 'geolib';

export default function DashboardPage() {
  const { stations: allStations, analytics, loading, error } = useLocalData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStation, setSelectedStation] = useState(null);

  // --- THE FIX IS HERE ---
  const filteredStations = useMemo(() => {
    const lowercasedQuery = searchQuery.trim().toLowerCase();
    if (!lowercasedQuery) {
      return allStations; // Return all stations if query is empty
    }
    
    return allStations.filter(station => {
      // Safely check and convert each property to a lower case string
      const stationName = station.name ? station.name.toLowerCase() : '';
      const stationId = station.id ? String(station.id).toLowerCase() : '';
      const stationState = station.state ? station.state.toLowerCase() : ''; // Add state to the search
      
      // Return true if the query is found in the name, ID, or state
      return stationName.includes(lowercasedQuery) || 
             stationId.includes(lowercasedQuery) ||
             stationState.includes(lowercasedQuery);
    });
  }, [allStations, searchQuery]);
  // -------------------------

  // Handler functions remain the same
  const handleDownload = () => {
    if (filteredStations.length === 0) return alert("No data to download.");
    const csv = Papa.unparse(filteredStations);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "groundwater_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleTraceLocation = () => {
    if (!navigator.geolocation) return alert("Geolocation is not supported.");
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      if (filteredStations.length === 0) return;
      const closest = filteredStations.reduce((closest, station) => {
        const distance = getDistance({ latitude, longitude }, { latitude: station.lat, longitude: station.lng });
        return distance < closest.distance ? { station, distance } : closest;
      }, { station: null, distance: Infinity });
      if (closest.station) setSelectedStation(closest.station);
    }, () => alert("Could not get your location."));
  };

  if (loading) return <div className="p-8 text-center">Loading Dashboard...</div>;
  if (error) return <div className="p-8 text-center text-red-400">Error: {error}</div>;

  return (
    <div className="flex h-full bg-base-dark">
      <LeftSidebar
        onDownload={handleDownload}
        onSearch={setSearchQuery}
        onTrace={handleTraceLocation}
        searchValue={searchQuery}
      />
      <main className="flex-1 h-full relative">
        <MapContainer
          stations={filteredStations}
          onMarkerClick={setSelectedStation}
          selectedStation={selectedStation} 
        />
      </main>
      <RightSidebar data={analytics} />
    </div>
  );
}
