import React, { useState } from "react";
import { mockStations } from "../../utils/mockData";

const PublicEngagement = () => {
  const [stationId, setStationId] = useState(mockStations[0]?.id || "");
  const [feedback, setFeedback] = useState("");
  const [submittedFeedback, setSubmittedFeedback] = useState({}); // store per station

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmittedFeedback((prev) => ({
      ...prev,
      [stationId]: [...(prev[stationId] || []), feedback],
    }));
    alert(`Feedback submitted for ${mockStations.find(s => s.id === stationId)?.district}: ${feedback}`);
    setFeedback("");
  };

  const station = mockStations.find((s) => s.id === stationId);

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-semibold text-dark mb-4">Public Engagement</h2>
      <p className="text-gray-600 mb-4">
        Gather feedback from local communities on groundwater policies per district.
      </p>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Select District:</label>
        <select
          value={stationId}
          onChange={(e) => setStationId(e.target.value)}
          className="px-3 py-2 border rounded w-full"
        >
          {mockStations.map((s) => (
            <option key={s.id} value={s.id}>
              {s.district} ({s.state})
            </option>
          ))}
        </select>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          className="w-full p-3 border rounded"
          rows="4"
          placeholder={`Share your suggestions for ${station?.district}...`}
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          required
        />
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Submit Feedback
        </button>
      </form>

      {submittedFeedback[stationId]?.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">Previous Feedback for {station?.district}:</h3>
          <ul className="list-disc list-inside space-y-1">
            {submittedFeedback[stationId].map((f, idx) => (
              <li key={idx} className="text-gray-700">{f}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PublicEngagement;
