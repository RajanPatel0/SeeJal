import React from 'react';

export default function FilterPanel({ onFilterChange }) {
  const handleStatusChange = (e) => {
    onFilterChange({ status: e.target.value });
  };

  return (
    <div className="mb-6 p-4 border rounded-lg bg-gray-50">
      <h3 className="font-semibold mb-2">Filter Stations</h3>
      <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700">
        Status
      </label>
      <select
        id="status-filter"
        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        onChange={handleStatusChange}
        defaultValue="all"
      >
        <option value="all">All</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
        <option value="maintenance">Maintenance</option>
      </select>
    </div>
  );
}
