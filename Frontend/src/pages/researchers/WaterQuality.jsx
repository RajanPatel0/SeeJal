import React from 'react';
import { Link } from 'react-router-dom';

const WaterQuality = () => {
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/researchers" className="text-primary hover:text-blue-700 text-sm font-medium mb-4 inline-flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Researcher Hub
          </Link>
          <h1 className="text-3xl font-bold text-dark mb-2">🏥 Data Quality Monitor</h1>
          <p className="text-gray-600">Track station reliability and data health metrics for research confidence</p>
        </div>

        {/* Coming Soon Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-6xl mb-6">🚧</div>
          <h2 className="text-2xl font-bold text-dark mb-4">Under Development</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            This monitoring tool will provide comprehensive data quality metrics for all DWLR stations.
            Assess data reliability, identify gaps, and ensure your research uses only the most
            trustworthy datasets.
          </p>
          <div className="inline-block bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-left">
            <h3 className="font-semibold text-dark mb-3">Planned Features:</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Station reliability scoring system
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Data gap detection and visualization
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Anomaly detection and flagging
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Quality assurance reports
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaterQuality;
