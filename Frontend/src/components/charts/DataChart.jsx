import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function DataChart({ data }) {
  return (
    <ResponsiveContainer>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="ts" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="gw_level_m" stroke="#8884d8" name="GW Level (m)" />
      </LineChart>
    </ResponsiveContainer>
  );
}
