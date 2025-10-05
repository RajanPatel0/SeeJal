import React, { useState } from "react";
import { mockStations } from "../utils/mockData";

const Reports = () => {
  const [reportConfig, setReportConfig] = useState({
    type: "station",
    format: "pdf",
    timeRange: "30days",
    language: "en",
    includeCharts: true,
    includeForecast: false,
  });
  const [selectedStation, setSelectedStation] = useState("");
  const [selectedState, setSelectedState] = useState("all");
  const [isGenerating, setIsGenerating] = useState(false);

  const reportTypes = [
    {
      id: "station",
      name: "Station Report",
      description: "Detailed report for a specific station",
    },
    {
      id: "regional",
      name: "Regional Report",
      description: "Summary report for a region or state",
    },
    {
      id: "comparative",
      name: "Comparative Analysis",
      description: "Compare multiple stations or regions",
    },
    {
      id: "trend",
      name: "Trend Analysis",
      description: "Long-term trend analysis report",
    },
    {
      id: "recharge",
      name: "Recharge Analysis",
      description: "Groundwater recharge events and patterns",
    },
  ];

  const formats = ["pdf", "excel", "csv"];
  const timeRanges = [
    { id: "7days", name: "Last 7 Days" },
    { id: "30days", name: "Last 30 Days" },
    { id: "90days", name: "Last 90 Days" },
    { id: "1year", name: "Last 1 Year" },
    { id: "custom", name: "Custom Range" },
  ];

  const languages = [
    { code: "en", name: "English" },
    { code: "hi", name: "Hindi" },
    { code: "pa", name: "Punjabi" },
  ];

  const states = [
    "all",
    ...new Set(mockStations.map((station) => station.state)),
  ];

  const handleGenerateReport = async () => {
    setIsGenerating(true);

    // Simulate report generation
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // In a real app, this would download the generated report
    const link = document.createElement("a");
    link.href = "/dummy-report.pdf";
    link.download = `SeeJal_Report_${
      new Date().toISOString().split("T")[0]
    }.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setIsGenerating(false);
  };

  const sampleReports = [
    {
      id: 1,
      name: "Punjab Regional Analysis",
      type: "regional",
      date: "2024-01-15",
      size: "2.4 MB",
      language: "en",
    },
    {
      id: 2,
      name: "DWLR_0042 Station Report",
      type: "station",
      date: "2024-01-14",
      size: "1.8 MB",
      language: "hi",
    },
    {
      id: 3,
      name: "National Trend Analysis",
      type: "trend",
      date: "2024-01-10",
      size: "3.1 MB",
      language: "en",
    },
  ];

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-dark mb-2">{t("reports")}</h1>
          <p className="text-gray-600">
            Generate comprehensive groundwater analysis reports
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Report Configuration Panel */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <h3 className="font-semibold text-dark mb-4">
                Report Configuration
              </h3>

              {/* Report Type Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Report Type
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {reportTypes.map((type) => (
                    <div
                      key={type.id}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                        reportConfig.type === type.id
                          ? "border-primary bg-blue-50 shadow-sm"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() =>
                        setReportConfig((prev) => ({ ...prev, type: type.id }))
                      }
                    >
                      <div className="font-medium text-dark mb-1">
                        {type.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {type.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Report Parameters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time Range
                  </label>
                  <select
                    value={reportConfig.timeRange}
                    onChange={(e) =>
                      setReportConfig((prev) => ({
                        ...prev,
                        timeRange: e.target.value,
                      }))
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {timeRanges.map((range) => (
                      <option key={range.id} value={range.id}>
                        {range.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Format
                  </label>
                  <div className="flex space-x-4">
                    {formats.map((format) => (
                      <label key={format} className="flex items-center">
                        <input
                          type="radio"
                          value={format}
                          checked={reportConfig.format === format}
                          onChange={() =>
                            setReportConfig((prev) => ({ ...prev, format }))
                          }
                          className="h-4 w-4 text-primary focus:ring-primary"
                        />
                        <span className="ml-2 text-gray-700">
                          {format.toUpperCase()}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <select
                    value={reportConfig.language}
                    onChange={(e) =>
                      setReportConfig((prev) => ({
                        ...prev,
                        language: e.target.value,
                      }))
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {languages.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State/Region
                  </label>
                  <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {states.map((state) => (
                      <option key={state} value={state}>
                        {state === "all" ? "All States" : state}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Station Selection (if station report) */}
              {reportConfig.type === "station" && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Station
                  </label>
                  <select
                    value={selectedStation}
                    onChange={(e) => setSelectedStation(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select a station</option>
                    {mockStations.map((station) => (
                      <option key={station.id} value={station.id}>
                        {station.name} ({station.district})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Additional Options */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Report Options
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={reportConfig.includeCharts}
                      onChange={(e) =>
                        setReportConfig((prev) => ({
                          ...prev,
                          includeCharts: e.target.checked,
                        }))
                      }
                      className="h-4 w-4 text-primary focus:ring-primary"
                    />
                    <span className="ml-2 text-gray-700">
                      Include charts and graphs
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={reportConfig.includeForecast}
                      onChange={(e) =>
                        setReportConfig((prev) => ({
                          ...prev,
                          includeForecast: e.target.checked,
                        }))
                      }
                      className="h-4 w-4 text-primary focus:ring-primary"
                    />
                    <span className="ml-2 text-gray-700">
                      Include AI forecast
                    </span>
                  </label>
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerateReport}
                disabled={
                  isGenerating ||
                  (reportConfig.type === "station" && !selectedStation)
                }
                className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {isGenerating ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Generating Report...
                  </>
                ) : (
                  `Generate Report (${reportConfig.format.toUpperCase()})`
                )}
              </button>
            </div>

            {/* Report Preview */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-dark mb-4">Report Preview</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <div className="text-4xl mb-4">📊</div>
                <h4 className="font-medium text-dark mb-2">
                  {reportTypes.find((t) => t.id === reportConfig.type)?.name}{" "}
                  Preview
                </h4>
                <p className="text-gray-600 mb-4">
                  This is a preview of how your {reportConfig.language} report
                  will look in {reportConfig.format.toUpperCase()} format.
                </p>
                <div className="bg-gray-100 rounded-lg p-4 text-left inline-block">
                  <div className="text-sm font-mono text-gray-700">
                    <div>• Water Level Trends</div>
                    <div>• Recharge Analysis</div>
                    <div>• Resource Calculation</div>
                    {reportConfig.includeForecast && <div>• AI Forecast</div>}
                    <div>• Recommendations</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Reports Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-dark mb-4">
                Report Statistics
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Reports Generated
                  </span>
                  <span className="font-semibold">1,247</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">This Month</span>
                  <span className="font-semibold">89</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Most Popular Format
                  </span>
                  <span className="font-semibold">PDF</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Average Size</span>
                  <span className="font-semibold">2.1 MB</span>
                </div>
              </div>
            </div>

            {/* Recent Reports */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-dark mb-4">Recent Reports</h3>
              <div className="space-y-4">
                {sampleReports.map((report) => (
                  <div
                    key={report.id}
                    className="border border-gray-200 rounded-lg p-3 hover:border-primary transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-medium text-dark text-sm">
                        {report.name}
                      </div>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {report.language.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>{report.date}</span>
                      <span>{report.size}</span>
                    </div>
                    <div className="flex space-x-2 mt-2">
                      <button className="text-xs text-primary hover:text-blue-700">
                        Download
                      </button>
                      <button className="text-xs text-gray-600 hover:text-gray-900">
                        Share
                      </button>
                      <button className="text-xs text-gray-600 hover:text-gray-900">
                        Regenerate
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Multi-Lingual Support */}
            <div className="bg-gradient-to-br from-secondary to-accent rounded-xl shadow-sm p-6 text-white">
              <h3 className="font-semibold mb-2">Multi-Lingual Reports</h3>
              <p className="text-sm opacity-90 mb-4">
                Generate reports in English, Hindi, Punjabi and other regional
                languages
              </p>
              <div className="flex space-x-2">
                {languages.map((lang) => (
                  <span
                    key={lang.code}
                    className="bg-white bg-opacity-20 px-2 py-1 rounded text-xs"
                  >
                    {lang.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
