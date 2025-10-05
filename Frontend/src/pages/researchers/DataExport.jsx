import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import DataCard from '../../components/common/DataCard';
import { mockStations } from '../../utils/mockData';

const DataExport = () => {
  const [selectedStations, setSelectedStations] = useState([]);
  const [dateFrom, setDateFrom] = useState('2024-09-01');
  const [dateTo, setDateTo] = useState('2024-12-31');
  const [exportFormat, setExportFormat] = useState('csv');
  const [citationFormat, setCitationFormat] = useState('apa');

  const [selectedParameters, setSelectedParameters] = useState({
    waterLevel: true,
    dailyStats: true,
    rainfall: true,
    rechargeEvents: true,
    trendComponents: true,
    rawSensor: false
  });

  const dataParameters = [
    { id: 'waterLevel', label: 'Water level (6-hourly)', desc: 'Depth to water table measurements' },
    { id: 'dailyStats', label: 'Daily statistics (min/max/avg)', desc: 'Statistical summary per day' },
    { id: 'rainfall', label: 'Rainfall data', desc: 'Precipitation records' },
    { id: 'rechargeEvents', label: 'Recharge events', desc: 'Detected recharge occurrences' },
    { id: 'trendComponents', label: 'Trend components', desc: 'Long-term trend analysis' },
    { id: 'rawSensor', label: 'Raw sensor data', desc: 'Unprocessed sensor readings' }
  ];

  const exportFormats = {
    analysis: [
      { id: 'csv', name: 'CSV', desc: 'Excel/R/Python compatible', icon: '📊', size: '~450 KB' },
      { id: 'excel', name: 'Excel', desc: 'Multiple sheets organized', icon: '📈', size: '~680 KB' },
      { id: 'json', name: 'JSON', desc: 'API format', icon: '💾', size: '~520 KB' }
    ],
    publication: [
      { id: 'charts-png', name: 'High-res Charts', desc: '300 DPI PNG', icon: '🖼️', size: '~2.1 MB' },
      { id: 'vector', name: 'Vector Graphics', desc: 'SVG/PDF', icon: '📐', size: '~180 KB' },
      { id: 'tables', name: 'Publication Tables', desc: 'Formatted tables', icon: '📄', size: '~95 KB' }
    ],
    package: [
      { id: 'complete', name: 'Complete Package', desc: 'All data + metadata + scripts', icon: '📚', size: '~3.5 MB' }
    ]
  };

  const exportTemplates = [
    { id: 'thesis', name: 'My Thesis Stations', stations: ['DWLR_0001', 'DWLR_0002', 'DWLR_0003'] },
    { id: 'ludhiana', name: 'All Ludhiana District', stations: mockStations.filter(s => s.district === 'Ludhiana').map(s => s.id) },
    { id: 'critical', name: 'Critical Stations Only', stations: mockStations.filter(s => s.status === 'critical').map(s => s.id) }
  ];

  const exportHistory = [
    { date: 'Feb 2, 2025', stations: 'PB001-PB005', format: 'CSV', size: '1.2 MB', id: 1 },
    { date: 'Jan 28, 2025', stations: 'All Punjab', format: 'Excel', size: '5.8 MB', id: 2 },
    { date: 'Jan 20, 2025', stations: 'LDH001-LDH010', format: 'JSON', size: '890 KB', id: 3 }
  ];

  // Calculate export preview
  const exportPreview = useMemo(() => {
    const selectedCount = Object.values(selectedParameters).filter(Boolean).length;
    const totalParams = Object.keys(selectedParameters).length;

    const daysRange = Math.ceil((new Date(dateTo) - new Date(dateFrom)) / (1000 * 60 * 60 * 24));
    const recordsPerDay = selectedParameters.waterLevel ? 4 : 1; // 6-hourly = 4 records/day
    const totalRecords = selectedStations.length * daysRange * recordsPerDay;

    const baseSizeKB = 0.15; // KB per record
    const estimatedSize = Math.round(totalRecords * baseSizeKB);

    return {
      records: totalRecords,
      size: estimatedSize < 1024 ? `${estimatedSize} KB` : `${(estimatedSize / 1024).toFixed(1)} MB`,
      parameters: selectedCount,
      totalParams,
      days: daysRange
    };
  }, [selectedStations, selectedParameters, dateFrom, dateTo]);

  // Generate citation
  const generateCitation = () => {
    const stationList = selectedStations.slice(0, 3).join(', ') + (selectedStations.length > 3 ? ' et al.' : '');
    const year = new Date().getFullYear();

    if (citationFormat === 'apa') {
      return `Central Ground Water Board. (${year}). Groundwater level data from DWLR stations ${stationList}, Punjab, India (${new Date(dateFrom).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}-${new Date(dateTo).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}). National Hydrology Project. Retrieved from https://seejal.gov.in`;
    } else {
      return `@dataset{cgwb${year},
  author = {Central Ground Water Board},
  title = {Groundwater level data from DWLR stations ${stationList}},
  year = {${year}},
  publisher = {National Hydrology Project},
  url = {https://seejal.gov.in},
  note = {Punjab, India, ${new Date(dateFrom).toLocaleDateString('en-US', { month: 'short' })}-${new Date(dateTo).toLocaleDateString('en-US', { month: 'short' })} ${year}}
}`;
    }
  };

  // Handle station selection
  const handleStationToggle = (stationId) => {
    setSelectedStations(prev =>
      prev.includes(stationId)
        ? prev.filter(id => id !== stationId)
        : [...prev, stationId]
    );
  };

  const handleSelectAll = () => {
    setSelectedStations(mockStations.map(s => s.id));
  };

  const handleClearAll = () => {
    setSelectedStations([]);
  };

  const handleParameterToggle = (param) => {
    setSelectedParameters(prev => ({
      ...prev,
      [param]: !prev[param]
    }));
  };

  const handleLoadTemplate = (template) => {
    setSelectedStations(template.stations);
  };

  // Export functions
  const handleExportCSV = () => {
    let csv = 'Station_ID,Date,Time,Water_Level_m,Rainfall_mm,Status,Aquifer_Type,District,State\n';

    selectedStations.forEach(stationId => {
      const station = mockStations.find(s => s.id === stationId);
      if (station) {
        station.data.forEach(dataPoint => {
          const date = new Date(dataPoint.date);
          if (date >= new Date(dateFrom) && date <= new Date(dateTo)) {
            // Generate 6-hourly data (simplified)
            const times = selectedParameters.waterLevel ? ['00:00', '06:00', '12:00', '18:00'] : ['12:00'];
            times.forEach(time => {
              csv += `${station.id},${dataPoint.date},${time},${dataPoint.level.toFixed(1)},${dataPoint.rainfall},${station.status},${station.aquiferType},${station.district},${station.state}\n`;
            });
          }
        });
      }
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `groundwater_data_${Date.now()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleExportJSON = () => {
    const data = {
      metadata: {
        exportDate: new Date().toISOString(),
        source: 'SeeJal - Central Ground Water Board',
        dateRange: { from: dateFrom, to: dateTo },
        stations: selectedStations.length,
        parameters: Object.keys(selectedParameters).filter(k => selectedParameters[k])
      },
      stations: selectedStations.map(stationId => {
        const station = mockStations.find(s => s.id === stationId);
        return {
          id: station.id,
          name: station.name,
          location: {
            district: station.district,
            state: station.state,
            coordinates: { lat: station.lat, lng: station.lng }
          },
          aquiferType: station.aquiferType,
          data: station.data.filter(d => {
            const date = new Date(d.date);
            return date >= new Date(dateFrom) && date <= new Date(dateTo);
          })
        };
      })
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `groundwater_data_${Date.now()}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleExport = () => {
    if (exportFormat === 'csv') {
      handleExportCSV();
    } else if (exportFormat === 'json') {
      handleExportJSON();
    } else if (exportFormat === 'excel') {
      alert('Excel export: Creating multi-sheet workbook...\nWould generate XLSX with separate sheets for each station.');
    } else if (exportFormat === 'complete') {
      alert('Complete Research Package:\n• Data files (CSV, JSON, Excel)\n• Metadata (README.md)\n• Citation (BibTeX, RIS)\n• Python analysis template\n• Station location map\n\nWould be packaged as ZIP file.');
    } else {
      alert(`Export format: ${exportFormat}\nThis would generate the selected format in production.`);
    }
  };

  const handleCopyCitation = () => {
    const citation = generateCitation();
    navigator.clipboard.writeText(citation);
    alert('Citation copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/researchers" className="text-primary hover:text-blue-700 text-sm font-medium mb-4 inline-flex items-center transition-colors">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Researcher Hub
          </Link>
          <div className="flex items-center gap-3 mb-3">
            <div className="text-4xl">📤</div>
            <h1 className="text-4xl font-bold text-gray-900">Research Data Export Center</h1>
          </div>
          <p className="text-lg text-gray-600">Export research-grade groundwater data with automatic citations and metadata</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <DataCard
            title="Stations Selected"
            value={selectedStations.length}
            subtitle={`of ${mockStations.length} available`}
            icon="📍"
            className="hover:shadow-xl transition-shadow"
          />
          <DataCard
            title="Date Range"
            value={`${exportPreview.days} days`}
            subtitle={`${new Date(dateFrom).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${new Date(dateTo).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
            icon="📅"
            className="hover:shadow-xl transition-shadow"
          />
          <DataCard
            title="Parameters"
            value={`${exportPreview.parameters}/${exportPreview.totalParams}`}
            subtitle="Data fields selected"
            icon="⚙️"
            className="hover:shadow-xl transition-shadow"
          />
          <DataCard
            title="Est. Records"
            value={exportPreview.records.toLocaleString()}
            subtitle={`~${exportPreview.size}`}
            icon="📊"
            className="hover:shadow-xl transition-shadow"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Data Selection */}
          <div className="space-y-6">
            {/* Station Selection */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">Select Stations</h3>
                <div className="flex gap-2">
                  <button
                    onClick={handleSelectAll}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium px-2 py-1 rounded border border-blue-200 hover:bg-blue-50"
                  >
                    All
                  </button>
                  <button
                    onClick={handleClearAll}
                    className="text-xs text-red-600 hover:text-red-700 font-medium px-2 py-1 rounded border border-red-200 hover:bg-red-50"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {selectedStations.length > 0 && (
                <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                  <span className="text-sm font-medium text-blue-900">
                    Selected: {selectedStations.slice(0, 3).join(', ')}
                    {selectedStations.length > 3 && ` +${selectedStations.length - 3} more`}
                  </span>
                </div>
              )}

              <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                {mockStations.map(station => (
                  <label
                    key={station.id}
                    className={`flex items-center p-2 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedStations.includes(station.id)
                        ? 'border-primary bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedStations.includes(station.id)}
                      onChange={() => handleStationToggle(station.id)}
                      className="h-4 w-4 text-primary focus:ring-primary rounded"
                    />
                    <div className="ml-3 flex-1">
                      <div className="text-sm font-semibold text-gray-900">{station.name}</div>
                      <div className="text-xs text-gray-500">{station.id} - {station.district}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Export Templates */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Templates</h3>
              <div className="space-y-2">
                {exportTemplates.map(template => (
                  <button
                    key={template.id}
                    onClick={() => handleLoadTemplate(template)}
                    className="w-full text-left p-3 rounded-lg border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all"
                  >
                    <div className="font-semibold text-sm text-gray-900">{template.name}</div>
                    <div className="text-xs text-gray-500">{template.stations.length} stations</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Middle Column - Parameters & Format */}
          <div className="space-y-6">
            {/* Date Range */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Date Range</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">From</label>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="w-full border-2 border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">To</label>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="w-full border-2 border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            {/* Data Parameters */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Data Parameters</h3>
              <div className="space-y-2">
                {dataParameters.map(param => (
                  <label
                    key={param.id}
                    className="flex items-start p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-all"
                  >
                    <input
                      type="checkbox"
                      checked={selectedParameters[param.id]}
                      onChange={() => handleParameterToggle(param.id)}
                      className="mt-1 h-4 w-4 text-primary focus:ring-primary rounded"
                    />
                    <div className="ml-3 flex-1">
                      <div className="text-sm font-semibold text-gray-900">{param.label}</div>
                      <div className="text-xs text-gray-500">{param.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Export Format */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Export Format</h3>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">📊 For Analysis</h4>
                  <div className="space-y-2">
                    {exportFormats.analysis.map(format => (
                      <label
                        key={format.id}
                        className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          exportFormat === format.id
                            ? 'border-primary bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="format"
                          value={format.id}
                          checked={exportFormat === format.id}
                          onChange={(e) => setExportFormat(e.target.value)}
                          className="h-4 w-4 text-primary focus:ring-primary"
                        />
                        <span className="text-2xl ml-3">{format.icon}</span>
                        <div className="ml-3 flex-1">
                          <div className="text-sm font-semibold text-gray-900">{format.name}</div>
                          <div className="text-xs text-gray-500">{format.desc}</div>
                        </div>
                        <div className="text-xs text-gray-400">{format.size}</div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">📄 For Publications</h4>
                  <div className="space-y-2">
                    {exportFormats.publication.map(format => (
                      <label
                        key={format.id}
                        className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          exportFormat === format.id
                            ? 'border-primary bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="format"
                          value={format.id}
                          checked={exportFormat === format.id}
                          onChange={(e) => setExportFormat(e.target.value)}
                          className="h-4 w-4 text-primary focus:ring-primary"
                        />
                        <span className="text-2xl ml-3">{format.icon}</span>
                        <div className="ml-3 flex-1">
                          <div className="text-sm font-semibold text-gray-900">{format.name}</div>
                          <div className="text-xs text-gray-500">{format.desc}</div>
                        </div>
                        <div className="text-xs text-gray-400">{format.size}</div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">📚 Research Package</h4>
                  <div className="space-y-2">
                    {exportFormats.package.map(format => (
                      <label
                        key={format.id}
                        className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          exportFormat === format.id
                            ? 'border-primary bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="format"
                          value={format.id}
                          checked={exportFormat === format.id}
                          onChange={(e) => setExportFormat(e.target.value)}
                          className="h-4 w-4 text-primary focus:ring-primary"
                        />
                        <span className="text-2xl ml-3">{format.icon}</span>
                        <div className="ml-3 flex-1">
                          <div className="text-sm font-semibold text-gray-900">{format.name}</div>
                          <div className="text-xs text-gray-500">{format.desc}</div>
                        </div>
                        <div className="text-xs text-gray-400">{format.size}</div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Preview & Citation */}
          <div className="space-y-6">
            {/* Export Preview */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl shadow-lg border border-blue-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">📦 Export Preview</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <span className="text-sm text-gray-600">Number of records</span>
                  <span className="font-bold text-gray-900">{exportPreview.records.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <span className="text-sm text-gray-600">File size estimate</span>
                  <span className="font-bold text-gray-900">{exportPreview.size}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <span className="text-sm text-gray-600">Selected parameters</span>
                  <span className="font-bold text-gray-900">{exportPreview.parameters} of {exportPreview.totalParams}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <span className="text-sm text-gray-600">Date range</span>
                  <span className="font-bold text-gray-900">{exportPreview.days} days</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <span className="text-sm text-gray-600">Format</span>
                  <span className="font-bold text-gray-900 uppercase">{exportFormat}</span>
                </div>
              </div>

              <button
                onClick={handleExport}
                disabled={selectedStations.length === 0}
                className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                {selectedStations.length === 0 ? 'Select Stations to Export' : 'Download Export'}
              </button>
            </div>

            {/* Auto-Generated Citation */}
            {selectedStations.length > 0 && (
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-lg border border-purple-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <span className="text-2xl mr-2">📖</span>
                  Auto-Generated Citation
                </h3>

                <div className="mb-4">
                  <div className="flex gap-2 mb-3">
                    <button
                      onClick={() => setCitationFormat('apa')}
                      className={`px-3 py-1 rounded-lg text-sm font-semibold transition-all ${
                        citationFormat === 'apa'
                          ? 'bg-purple-600 text-white'
                          : 'bg-white text-gray-700 border border-gray-300'
                      }`}
                    >
                      APA
                    </button>
                    <button
                      onClick={() => setCitationFormat('bibtex')}
                      className={`px-3 py-1 rounded-lg text-sm font-semibold transition-all ${
                        citationFormat === 'bibtex'
                          ? 'bg-purple-600 text-white'
                          : 'bg-white text-gray-700 border border-gray-300'
                      }`}
                    >
                      BibTeX
                    </button>
                  </div>

                  <div className="p-4 bg-white rounded-lg border border-purple-100 font-mono text-xs leading-relaxed text-gray-700 overflow-x-auto">
                    {generateCitation()}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleCopyCitation}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy
                  </button>
                  <button className="flex-1 bg-white hover:bg-gray-50 text-purple-600 border border-purple-300 font-semibold py-2 px-4 rounded-lg transition-all">
                    Download
                  </button>
                </div>
              </div>
            )}

            {/* Metadata Preview */}
            {selectedStations.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">📦 Included Metadata</h3>
                <div className="space-y-4 text-sm">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Station Information:</h4>
                    <ul className="space-y-1 text-gray-600 ml-4">
                      <li>• Coordinates (Lat/Long)</li>
                      <li>• Aquifer type</li>
                      <li>• Well depth</li>
                      <li>• Installation date</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Data Quality:</h4>
                    <ul className="space-y-1 text-gray-600 ml-4">
                      <li>• Completeness: 99.2%</li>
                      <li>• Known gaps: June 5-7, 2024</li>
                      <li>• Calibration: Dec 2024</li>
                    </ul>
                  </div>

                  <button className="w-full mt-3 text-primary hover:text-blue-700 font-semibold py-2 px-4 rounded-lg border border-blue-200 hover:bg-blue-50 transition-all">
                    View Full Metadata
                  </button>
                </div>
              </div>
            )}

            {/* Export History */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">📜 Recent Exports</h3>
              <div className="space-y-3">
                {exportHistory.map(item => (
                  <div key={item.id} className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{item.stations}</div>
                        <div className="text-xs text-gray-500">{item.date}</div>
                      </div>
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                        {item.format}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{item.size}</span>
                      <button className="text-xs text-blue-600 hover:text-blue-700 font-semibold">
                        Re-download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataExport;
