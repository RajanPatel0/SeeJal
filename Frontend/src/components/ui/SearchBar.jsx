import React from 'react';

export default function SearchBar({ onSearch, value }) {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Find station by name or ID..."
        value={value} // The input's displayed value is controlled by state
        onChange={(e) => onSearch(e.target.value)} // Typing updates the state
        className="w-full bg-base-dark border border-gray-600 rounded-md p-2 pl-8 focus:ring-accent-yellow focus:border-accent-yellow"
      />
      <svg className="w-4 h-4 absolute left-2.5 top-3 text-text-darker" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
    </div>
  );
}
