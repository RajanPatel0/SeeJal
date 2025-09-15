import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import the required CSS for Leaflet maps to render correctly
import 'leaflet/dist/leaflet.css'; 

import DashboardPage from './pages/DashboardPage';
import ResearchPage from './pages/ResearchPage';
import ReportsPage from './pages/ReportsPage';
import Header from './components/ui/Header';

function App() {
  return (
    <Router>
      <div className="flex flex-col h-screen bg-base-dark text-text-light">
        <Header />
        <main className="flex-1 overflow-hidden">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/research" element={<ResearchPage />} />
            <Route path="/reports" element={<ReportsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
