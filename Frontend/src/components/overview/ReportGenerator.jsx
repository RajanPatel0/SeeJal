import React, { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { mockStations } from "../../utils/mockData";

const ReportGenerator = () => {
  const reportRef = useRef();

  const handleDownloadPDF = async () => {
    const input = reportRef.current;
    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("Groundwater_Report.pdf");
  };

  const critical = mockStations.filter((s) => s.status === "critical").length;
  const safe = mockStations.filter((s) => s.status === "safe").length;
  const avgLevel =
    mockStations.reduce((sum, s) => sum + s.currentLevel, 0) /
    mockStations.length;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">📄 Quick Report Generator</h2>
        <button
          onClick={handleDownloadPDF}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Download PDF
        </button>
      </div>
      <p className="text-gray-600 mb-4">
        Generate professional PDF summaries for quick communication with government officials.
      </p>

      {/* Report Section */}
      <div ref={reportRef} className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold text-lg mb-3">Monthly Status Report</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <Stat label="Critical Stations" value={critical} color="text-red-600" />
          <Stat label="Safe Stations" value={safe} color="text-green-600" />
          <Stat label="Average Water Level" value={`${avgLevel.toFixed(1)}m`} color="text-blue-600" />
        </div>

        <table className="w-full text-sm bg-white rounded-md border border-gray-200">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="text-left py-2 px-3">Station</th>
              <th className="text-left py-2 px-3">State</th>
              <th className="text-right py-2 px-3">Level (m)</th>
              <th className="text-right py-2 px-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {mockStations.slice(0, 10).map((s, i) => (
              <tr key={i} className="border-b">
                <td className="py-2 px-3">{s.name}</td>
                <td className="py-2 px-3">{s.state}</td>
                <td className="text-right py-2 px-3">{s.currentLevel.toFixed(1)}</td>
                <td
                  className={`text-right py-2 px-3 ${
                    s.status === "critical"
                      ? "text-red-600"
                      : s.status === "safe"
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                >
                  {s.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 text-sm text-gray-600 italic">
          Auto-generated report — data simulated from mockStations.
        </div>
      </div>
    </div>
  );
};

const Stat = ({ label, value, color }) => (
  <div className="bg-white shadow-sm p-3 rounded-lg text-center border border-gray-200">
    <div className={`text-2xl font-bold ${color}`}>{value}</div>
    <div className="text-gray-600">{label}</div>
  </div>
);

export default ReportGenerator;
