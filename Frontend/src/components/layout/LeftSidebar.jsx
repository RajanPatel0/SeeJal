import React from 'react';
import SearchBar from '../ui/SearchBar';

export default function LeftSidebar({ onDownload, onSearch, onTrace, searchValue }) {
  return (
    <aside className="w-80 h-full bg-panel-dark p-4 space-y-6 overflow-y-auto">
      <SearchBar onSearch={onSearch} value={searchValue} />
      
      <div className="space-y-4 pt-4 border-t border-gray-600">
        <button
          onClick={onTrace}
          className="w-full bg-blue-600 text-white font-bold py-2 rounded transition-transform transform hover:scale-105"
        >
          Trace My Location
        </button>
        <button
          onClick={onDownload}
          className="w-full bg-accent-yellow text-panel-dark font-bold py-2 rounded transition-transform transform hover:scale-105"
        >
          Download Displayed Data (CSV)
        </button>
      </div>
    </aside>
  );
}
