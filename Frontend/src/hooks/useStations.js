import { useState, useEffect, useMemo } from 'react';

export function useStations() {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: 'all' });

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/data/stations.json');
        const data = await response.json();
        setStations(data);
      } catch (error) {
        console.error("Failed to fetch stations:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredStations = useMemo(() => {
    if (filters.status === 'all') {
      return stations;
    }
    return stations.filter(s => s.status === filters.status);
  }, [stations, filters]);

  return { loading, stations: filteredStations, setFilters };
}
