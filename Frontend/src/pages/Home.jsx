import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import StationMap from "../components/maps/StationMap";
import { getSummaryStats, mockStations } from "../utils/mockData";

const Home = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState(null);

  const summaryStats = getSummaryStats();

  // Simplified key stats for better mobile display
  const keyStats = [
    { value: summaryStats.total.toLocaleString(), label: "Stations" },
    { value: summaryStats.critical.toLocaleString(), label: "Critical" },
    { value: `${summaryStats.normal}%`, label: "Normal" },
  ];

  // Simplified core features for mobile-first design
  const coreFeatures = [
    {
      icon: "📊",
      title: "Real-Time",
      description: "Live monitoring data",
    },
    {
      icon: "⚠️",
      title: "Alerts",
      description: "Instant notifications",
    },
    {
      icon: "📈",
      title: "Analytics",
      description: "Smart insights",
    },
  ];

  // Function to handle location fetching
  const fetchMyLocation = () => {
    setIsLoadingLocation(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser.");
      setIsLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        // Find nearest station with improved logic
        let nearestStation = null;
        let minDistance = Infinity;

        console.log("User location:", latitude, longitude);
        console.log("Available stations:", mockStations.length);

        mockStations.forEach((station) => {
          const R = 6371; // Earth's radius in kilometers
          const dLat = ((station.lat - latitude) * Math.PI) / 180;
          const dLon = ((station.lng - longitude) * Math.PI) / 180;
          const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((latitude * Math.PI) / 180) *
              Math.cos((station.lat * Math.PI) / 180) *
              Math.sin(dLon / 2) *
              Math.sin(dLon / 2);
          const distance = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

          console.log(
            `Station ${station.name}: ${distance.toFixed(2)} km away`
          );

          if (distance < minDistance) {
            minDistance = distance;
            nearestStation = station;
          }
        });

        console.log(
          "Nearest station found:",
          nearestStation?.name,
          "at",
          minDistance,
          "km"
        );

        if (nearestStation && minDistance < Infinity) {
          // Always navigate to the closest station, regardless of distance
          navigate(`/station/${nearestStation.id}`);
        } else {
          // Fallback: if no station found, navigate to first available station
          if (mockStations.length > 0) {
            console.log("Using fallback station:", mockStations[0].name);
            navigate(`/station/${mockStations[0].id}`);
          } else {
            setLocationError(
              "Unable to find any monitoring stations in the database."
            );
          }
        }
        setIsLoadingLocation(false);
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError(
              "Location access denied. Please enable location permissions."
            );
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError("Location information is unavailable.");
            break;
          case error.TIMEOUT:
            setLocationError("Location request timed out.");
            break;
          default:
            setLocationError(
              "An unknown error occurred while fetching location."
            );
            break;
        }
        setIsLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-emerald-50 text-slate-800 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating particles */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-blue-200 rounded-full particle-float opacity-60"></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-emerald-200 rounded-full particle-float opacity-50"></div>
        <div className="absolute bottom-40 left-20 w-2 h-2 bg-cyan-200 rounded-full particle-float opacity-40"></div>
        <div className="absolute bottom-60 right-10 w-4 h-4 bg-green-200 rounded-full particle-float opacity-30"></div>

        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-blue-200 to-cyan-200 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-gradient-to-r from-emerald-200 to-green-200 rounded-full opacity-15 blur-xl"></div>

        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 bg-mesh opacity-30"></div>
      </div>
      {/* Hero Section - Compact */}
      <div className="py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-emerald-600 rounded-xl shadow-lg mb-3 animate-bounce">
              <span className="text-white text-xl">💧</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2 animate-pulse">
              See
              <span
                className="hindi-text hindi-gradient title-float"
                style={{ fontFamily: "Noto Sans Devanagari, sans-serif" }}
              >
                जल
              </span>
            </h1>
            <p className="text-slate-700 text-sm sm:text-base max-w-2xl mx-auto">
              Advanced Groundwater Monitoring Platform for India
            </p>
          </div>

          {/* Compact Stats */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-6 max-w-xl mx-auto">
            {keyStats.map((stat, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm p-2 sm:p-3 border border-white/50 hover:shadow-lg hover:scale-105 transition-all duration-300 hover:bg-white/90"
              >
                <div className="text-lg sm:text-xl font-bold text-blue-700 mb-1 animate-pulse">
                  {stat.value}
                </div>
                <div className="text-xs text-slate-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center mb-6">
            <Link
              to="/dashboard"
              className="btn-sophisticated text-sm flex items-center justify-center"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              Dashboard
            </Link>
            <button
              onClick={fetchMyLocation}
              disabled={isLoadingLocation}
              className={`btn-sophisticated text-sm flex items-center justify-center ${
                isLoadingLocation
                  ? "opacity-50 cursor-not-allowed"
                  : "btn-ripple wave-interactive"
              }`}
            >
              {isLoadingLocation ? (
                <>
                  <div className="loading-sophisticated mr-2"></div>
                  Locating...
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4 mr-2 icon-premium"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Find Station
                </>
              )}
            </button>
          </div>

          {locationError && (
            <div className="max-w-md mx-auto p-2 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{locationError}</p>
            </div>
          )}
        </div>
      </div>

      {/* Map Section - Compact */}
      <div className="py-4 sm:py-6 bg-white/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-slate-800 mb-1">
              Live Monitoring Network
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm">
              Real-time groundwater monitoring across India • 5,260+ DWLR
              stations
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-slate-200">
            <div className="h-64 sm:h-80">
              <StationMap />
            </div>
          </div>
        </div>
      </div>

      {/* System Status - Compact */}
      <div className="py-4 sm:py-6 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
              <h3 className="text-base font-bold text-slate-800 mb-3 flex items-center">
                <svg
                  className="w-4 h-4 mr-2 text-emerald-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                System Status
              </h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center justify-between p-2 bg-emerald-50 rounded">
                  <span className="text-slate-700">Network</span>
                  <span className="text-emerald-600 font-semibold flex items-center">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-1 animate-pulse"></div>
                    Online
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                  <span className="text-slate-700">Data</span>
                  <span className="text-blue-600 font-semibold">Real-time</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-amber-50 rounded">
                  <span className="text-slate-700">Coverage</span>
                  <span className="text-amber-600 font-semibold">98.5%</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-purple-50 rounded">
                  <span className="text-slate-700">Last Sync</span>
                  <span className="text-purple-600 font-semibold">Now</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
              <h3 className="text-base font-bold text-slate-800 mb-3 flex items-center">
                <svg
                  className="w-4 h-4 mr-2 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
                Critical Alerts
              </h3>
              <div className="space-y-2">
                {summaryStats.critical > 0 ? (
                  <>
                    <div className="p-2 bg-red-50 border border-red-200 rounded text-sm">
                      <div className="font-medium text-red-700">
                        Punjab Region
                      </div>
                      <div className="text-xs text-red-600">
                        High water levels detected
                      </div>
                    </div>
                    <div className="p-2 bg-orange-50 border border-orange-200 rounded text-sm">
                      <div className="font-medium text-orange-700">
                        Rajasthan Region
                      </div>
                      <div className="text-xs text-orange-600">
                        Threshold exceeded
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="p-2 bg-emerald-50 border border-emerald-200 rounded text-center text-sm">
                    <div className="font-medium text-emerald-700">
                      All Systems Normal
                    </div>
                    <div className="text-xs text-emerald-600">
                      No critical alerts
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features - Compact */}
      <div className="py-4 sm:py-6 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 via-cyan-50 to-emerald-50 rounded-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border border-blue-100">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-3 text-lg animate-pulse">
                📊
              </div>
              <h3 className="text-sm font-bold text-slate-800 mb-1">
                Real-Time Monitoring
              </h3>
              <p className="text-xs text-slate-600">
                Live data from 5,260+ stations
              </p>
            </div>

            <div className="text-center p-4 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 rounded-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border border-emerald-100">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-green-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-3 text-lg animate-pulse">
                ⚠️
              </div>
              <h3 className="text-sm font-bold text-slate-800 mb-1">
                Smart Alerts
              </h3>
              <p className="text-xs text-slate-600">
                AI-powered early warnings
              </p>
            </div>

            <div className="text-center p-4 bg-gradient-to-br from-green-50 via-emerald-50 to-blue-50 rounded-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border border-green-100">
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-3 text-lg animate-pulse">
                📈
              </div>
              <h3 className="text-sm font-bold text-slate-800 mb-1">
                Advanced Analytics
              </h3>
              <p className="text-xs text-slate-600">
                15-day forecasting & trends
              </p>
            </div>
          </div>

          <div className="text-center">
            <Link
              to="/dashboard"
              className="btn-sophisticated text-sm inline-block text-center"
            >
              Get Started →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
