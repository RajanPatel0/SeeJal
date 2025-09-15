import { useState, useEffect } from 'react';

export function useLocalData() {
  const [stations, setStations] = useState([]);
  const [analytics, setAnalytics] = useState(null); // Add state for analytics data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch both files in parallel for efficiency
        const [stationsResponse, analyticsResponse] = await Promise.all([
          fetch('/data/stations.json'),
          fetch('/data/analytics.json')
        ]);

        if (!stationsResponse.ok) {
          throw new Error('Could not find /data/stations.json in public directory');
        }
        if (!analyticsResponse.ok) {
          throw new Error('Could not find /data/analytics.json in public directory');
        }

        const stationsData = await stationsResponse.json();
        const analyticsData = await analyticsResponse.json();

        // Format station data to ensure consistency
        const formattedStations = stationsData.map((record, index) => ({
          id: record['s-no'] || record.id || `stn-${index}`,
          name: record.location || record.name || 'Unknown Location',
          lat: parseFloat(record.lat),
          lng: parseFloat(record.long || record.lng),
          state: record.state || 'Unknown'
        }));

        setStations(formattedStations);
        setAnalytics(analyticsData); // Set the fetched analytics data

      } catch (e) {
        setError(e.message);
        console.error("Failed to fetch local data:", e);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Return all the data states
  return { stations, analytics, loading, error };
}
