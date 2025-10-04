import React from "react";

// Existing components
import ExecutiveSummary from "../components/overview/ExecutiveSummary";
import RiskHeatmap from "../components/overview/RiskHeatmap";
import InterventionTracker from "../components/overview/InterventionTracker";
import Forecasting from "../components/overview/Forecasting";
import ResourceAdvisor from "../components/overview/ResourceAdvisor";
import ComplianceOverview from "../components/overview/ComplianceOverview";
import ReportGenerator from "../components/overview/ReportGenerator";

// ✅ New components based on PDF
import ScenarioSimulator from "../components/overview/ScenarioSimulator";
import RechargePotentialMap from "../components/overview/RechargePotentialMap";
import CropWaterInsights from "../components/overview/CropWaterInsights";
import PublicEngagement from "../components/overview/PublicEngagement";
import AIForecastRiskMap from "../components/overview/AIForecastRiskMap";
import IntegrationDashboard from "../components/overview/IntegrationDashboard";

const Overview = () => {
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-dark mb-2">Research & Policy Tools</h1>
          <p className="text-gray-600">
            Comprehensive policy intelligence for groundwater management and decision-making.
          </p>
        </div>

        {/* Components */}
        <div className="space-y-10">
          <ExecutiveSummary />
          <RiskHeatmap />
          <ScenarioSimulator />          {/* 🔄 New */}
          <RechargePotentialMap />       {/* 🔄 New */}
          <InterventionTracker />
          <Forecasting />
          <AIForecastRiskMap />          {/* 🔄 New */}
          <ResourceAdvisor />
          <CropWaterInsights />          {/* 🔄 New */}
          <ComplianceOverview />
          <PublicEngagement />           {/* 🔄 New */}
          <IntegrationDashboard />       {/* 🔄 New */}
          <ReportGenerator />
        </div>
      </div>
    </div>
  );
};

export default Overview;
