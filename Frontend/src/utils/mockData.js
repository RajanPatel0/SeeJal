
// Pre-defined array of real Indian districts with their actual approximate coordinates.
// This ensures 'Ludhiana' always appears in the correct place in Punjab.
const realIndianDistricts = [
    // Punjab
    { district: 'Amritsar', state: 'Punjab', lat: 31.6340, lng: 74.8723 },
    { district: 'Ludhiana', state: 'Punjab', lat: 30.9010, lng: 75.8573 },
    { district: 'Jalandhar', state: 'Punjab', lat: 31.3260, lng: 75.5762 },
    { district: 'Patiala', state: 'Punjab', lat: 30.3398, lng: 76.3869 },
    { district: 'Bathinda', state: 'Punjab', lat: 30.2110, lng: 74.9456 },
    // Haryana
    { district: 'Faridabad', state: 'Haryana', lat: 28.4089, lng: 77.3178 },
    { district: 'Gurugram', state: 'Haryana', lat: 28.4595, lng: 77.0266 },
    { district: 'Hisar', state: 'Haryana', lat: 29.1492, lng: 75.7217 },
    { district: 'Rohtak', state: 'Haryana', lat: 28.8955, lng: 76.6066 },
    { district: 'Karnal', state: 'Haryana', lat: 29.6857, lng: 76.9905 },
    // Rajasthan
    { district: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lng: 75.7873 },
    { district: 'Jodhpur', state: 'Rajasthan', lat: 26.2389, lng: 73.0243 },
    { district: 'Udaipur', state: 'Rajasthan', lat: 24.5854, lng: 73.7125 },
    { district: 'Kota', state: 'Rajasthan', lat: 25.2138, lng: 75.8648 },
    { district: 'Ajmer', state: 'Rajasthan', lat: 26.4499, lng: 74.6399 },
    { district: 'Bikaner', state: 'Rajasthan', lat: 28.0229, lng: 73.3119 },
    { district: 'Alwar', state: 'Rajasthan', lat: 27.5535, lng: 76.6346 },
    // Gujarat
    { district: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lng: 72.5714 },
    { district: 'Surat', state: 'Gujarat', lat: 21.1702, lng: 72.8311 },
    { district: 'Vadodara', state: 'Gujarat', lat: 22.3072, lng: 73.1812 },
    { district: 'Rajkot', state: 'Gujarat', lat: 22.3039, lng: 70.8022 },
    // Maharashtra
    { district: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lng: 72.8777 },
    { district: 'Pune', state: 'Maharashtra', lat: 18.5204, lng: 73.8567 },
    { district: 'Nagpur', state: 'Maharashtra', lat: 21.1458, lng: 79.0882 },
    { district: 'Nashik', state: 'Maharashtra', lat: 20.0059, lng: 73.7900 },
    // ... ADD MORE DISTRICTS FOR OTHER STATES HERE ...
    // Karnataka
    { district: 'Bangalore', state: 'Karnataka', lat: 12.9716, lng: 77.5946 },
    { district: 'Mysore', state: 'Karnataka', lat: 12.2958, lng: 76.6394 },
    // Tamil Nadu
    { district: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707 },
    { district: 'Coimbatore', state: 'Tamil Nadu', lat: 11.0168, lng: 76.9558 },
    // Uttar Pradesh
    { district: 'Lucknow', state: 'Uttar Pradesh', lat: 26.8467, lng: 80.9462 },
    { district: 'Kanpur', state: 'Uttar Pradesh', lat: 26.4499, lng: 80.3319 },
    { district: 'Varanasi', state: 'Uttar Pradesh', lat: 25.3176, lng: 82.9739 },
    // Bihar
    { district: 'Patna', state: 'Bihar', lat: 25.5941, lng: 85.1376 },
    // West Bengal
    { district: 'Kolkata', state: 'West Bengal', lat: 22.5726, lng: 88.3639 },
    // Madhya Pradesh
    { district: 'Bhopal', state: 'Madhya Pradesh', lat: 23.2599, lng: 77.4126 },
    { district: 'Indore', state: 'Madhya Pradesh', lat: 22.7196, lng: 75.8577 },
    // Andhra Pradesh
    { district: 'Visakhapatnam', state: 'Andhra Pradesh', lat: 17.6868, lng: 83.2185 },
];

export const generateMockStations = () => {
    const stations = [];

    // Use the pre-defined list to create stations.
    // This guarantees that a district's name matches its coordinates.
    realIndianDistricts.forEach((location, index) => {
        const currentLevel = Math.random() * 50 + 5; // 5-55 meters
        const minLevel = Math.max(2, currentLevel - Math.random() * 10);
        const trend = Math.random() > 0.5 ? 'increasing' : 'decreasing';

        let status = 'safe';
        if (currentLevel > 40) status = 'critical';
        else if (currentLevel > 30) status = 'semi-critical';

        // Generate realistic historical data
        const historicalData = [];
        const baseDate = new Date();
        for (let j = 29; j >= 0; j--) {
            const date = new Date(baseDate);
            date.setDate(date.getDate() - j);
            const dailyFluctuation = (Math.random() - 0.5) * 0.3;
            const seasonalEffect = Math.sin(j / 30 * Math.PI) * 2;
            const level = currentLevel + dailyFluctuation * j + seasonalEffect;

            historicalData.push({
                date: date.toISOString().split('T')[0],
                level: parseFloat(Math.max(1, level).toFixed(2)),
                rainfall: Math.random() > 0.7 ? Math.random() * 50 : 0
            });
        }

        stations.push({
            id: `DWLR_${(index + 1).toString().padStart(4, '0')}`,
            name: `${location.district} Monitoring Station`,
            state: location.state,
            district: location.district,
            lat: location.lat,
            lng: location.lng, // Use the pre-defined coordinate
            currentLevel: parseFloat(currentLevel.toFixed(2)),
            minLevel: parseFloat(minLevel.toFixed(2)),
            trend,
            status,
            aquiferType: ['Alluvial', 'Basalt', 'Laterite', 'Sandstone'][Math.floor(Math.random() * 4)],
            specificYield: parseFloat((Math.random() * 0.1 + 0.1).toFixed(3)),
            area: Math.floor(Math.random() * 100 + 10),
            lastUpdated: new Date().toISOString(),
            data: historicalData
        });
    });

    return stations;
};

export const mockStations = generateMockStations();


// Summary statistics
export const getSummaryStats = () => {
  const total = mockStations.length;
  const critical = mockStations.filter(s => s.status === 'critical').length;
  const normal = mockStations.filter(s => s.status === 'safe').length;
  const semiCritical = mockStations.filter(s => s.status === 'semi-critical').length;
  
  return { total, critical, normal, semiCritical };
};

// Helper function to get station by ID
export const getStationById = (id) => {
  return mockStations.find(station => station.id === id);
};