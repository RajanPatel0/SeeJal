import React from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function BarChart({ data }) {
  // Guard against cases where data might not be available yet
  if (!data || data.length === 0) {
    return <p className="text-center text-gray-500">No state data available.</p>;
  }

  // Sort the data to show states with the most stations at the top
  const sortedData = [...data].sort((a, b) => b['Total Stations'] - a['Total Stations']);

  return (
    <div className="bg-base-dark p-4 rounded-lg">
      <h3 className="text-center text-white font-semibold mb-4">State Wise Station Count</h3>
      <div className="w-full h-[600px]"> {/* Height is increased for better readability */}
        <ResponsiveContainer>
          <RechartsBarChart
            layout="vertical" // Use a vertical layout to give labels space
            data={sortedData}
            margin={{ top: 5, right: 30, left: 50, bottom: 5 }} // Ensure left margin is enough for long names
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
            <XAxis type="number" stroke="#9ca3af" fontSize={12} />
            
            {/* --- THIS IS THE FIX --- */}
            <YAxis
              type="category"
              dataKey="name" // This tells the chart to use the "name" property for the labels
              stroke="#9ca3af"
              fontSize={10}
              width={100} // Explicitly give the axis labels space
              tick={{ fill: '#e5e7eb' }} // Style the label text color
              interval={0} // This ensures all labels are shown and none are skipped
            />
            {/* ---------------------- */}

            <Tooltip contentStyle={{ backgroundColor: '#292c31', border: 'none' }} />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
            <Bar dataKey="Total Stations" fill="#00f6ff" />
            <Bar dataKey="Monitored Stations" fill="#fbbd08" />
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
