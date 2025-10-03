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
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/industrial" element={<IndustrialDashboard />} />
            <Route path="/industrial/site/:id" element={<IndustrialSiteDetail />} />
            
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;