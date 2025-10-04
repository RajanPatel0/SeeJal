import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './utils/i18n';
import './App.css';

// Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import StationDetail from './pages/StationDetail';
import Analytics from './pages/Analytics';
import Reports from './pages/Reports';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import IndustrialDashboard from './pages/industrial/IndustrialDashboard';
import IndustrialSiteDetail from './pages/industrial/IndustrialSiteDetail';
import ResearcherHub from './pages/researchers/ResearcherHub';
import StationComparison from './pages/researchers/StationComparison';
import RechargeAnalysis from './pages/researchers/RechargeAnalysis';
import DataQuality from './pages/researchers/DataQuality';
import DataExport from './pages/researchers/DataExport';
import SeasonalAnalysis from './pages/researchers/SeasonalAnalysis';
import Overview from './pages/Overview';

function App() {
  const { t } = useTranslation();

  return (
    <Router>
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/station/:id" element={<StationDetail />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/researchers" element={<ResearcherHub />} />
            <Route path="/researchers/compare" element={<StationComparison />} />
            <Route path="/researchers/recharge" element={<RechargeAnalysis />} />
            <Route path="/researchers/quality" element={<DataQuality />} />
            <Route path="/researchers/export" element={<DataExport />} />
            <Route path="/researchers/seasonal" element={<SeasonalAnalysis />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/industrial" element={<IndustrialDashboard />} />
            <Route path="/industrial/site/:id" element={<IndustrialSiteDetail />} />
            <Route path="/overview" element={<Overview />} />

          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;