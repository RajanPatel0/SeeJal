import React from 'react';
import { Link } from 'react-router-dom';
import DataCard from '../../components/common/DataCard';
import { mockStations, getSummaryStats } from '../../utils/mockData';

const ResearcherHub = () => {
  const stats = getSummaryStats();

  const researchTools = [
    {
      path: '/researchers/compare',
      emoji: '📊',
      title: 'Station Comparison Lab',
      description: 'Compare water levels across multiple stations with statistical analysis and correlation metrics',
      gradient: 'from-blue-500 to-blue-600',
      hoverGradient: 'hover:from-blue-600 hover:to-blue-700',
      textColor: 'text-blue-100',
      enabled: true
    },
    {
      path: '/researchers/recharge',
      emoji: '💧',
      title: 'Recharge Event Tracker',
      description: 'Detect and quantify groundwater recharge events with rainfall correlation analysis',
      gradient: 'from-green-500 to-green-600',
      hoverGradient: 'hover:from-green-600 hover:to-green-700',
      textColor: 'text-green-100',
      enabled: true
    },
    {
      path: '/researchers/quality',
      emoji: '🏥',
      title: 'Data Quality Monitor',
      description: 'Track station reliability and data health metrics for research confidence',
      gradient: 'from-yellow-500 to-yellow-600',
      hoverGradient: 'hover:from-yellow-600 hover:to-yellow-700',
      textColor: 'text-yellow-100',
      enabled: true
    },
    {
      path: '/researchers/export',
      emoji: '📤',
      title: 'Data Export Center',
      description: 'Export research-grade data with multiple formats and automatic citations',
      gradient: 'from-purple-500 to-purple-600',
      hoverGradient: 'hover:from-purple-600 hover:to-purple-700',
      textColor: 'text-purple-100',
      enabled: true
    },
    {
      path: '/researchers/seasonal',
      emoji: '📅',
      title: 'Seasonal Intelligence',
      description: 'Analyze pre-monsoon, monsoon, and post-monsoon patterns with multi-year comparisons',
      gradient: 'from-orange-500 to-orange-600',
      hoverGradient: 'hover:from-orange-600 hover:to-orange-700',
      textColor: 'text-orange-100',
      enabled: true
    },
    {
      path: '#',
      emoji: '📈',
      title: 'Coming Soon',
      description: 'More research tools in development: Statistical Analysis Toolkit • Custom Monitoring Sets • Research Notes System',
      gradient: 'from-gray-400 to-gray-500',
      hoverGradient: '',
      textColor: 'text-gray-200',
      enabled: false
    }
  ];

  const recentActivity = [
    { activity: 'Station comparison: PB001-PB005', time: '2 hours ago', icon: '📊' },
    { activity: 'Recharge analysis: Ludhiana District', time: 'Yesterday', icon: '💧' },
    { activity: 'Data export: Punjab Region', time: '3 days ago', icon: '📤' }
  ];

  const resources = [
    'CGWB Guidelines & Best Practices',
    'Data Quality Standards',
    'Research Methodology Documentation',
    'API Documentation (Coming Soon)'
  ];

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <div className="flex justify-center mb-4">
            <div className="text-6xl">🔬</div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-dark mb-4">
            Researcher Workspace
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Advanced Tools for Groundwater Analysis
          </p>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Access specialized tools designed for scientific research, data analysis, and
            informed decision-making.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <DataCard
            title="Total DWLR Stations"
            value={stats.total.toLocaleString()}
            subtitle="Active monitoring points"
            icon="📍"
            className="hover:shadow-lg transition-shadow duration-300"
          />
          <DataCard
            title="Active Researchers"
            value="347"
            subtitle="Registered users"
            icon="👥"
            trend={{ value: 12, label: 'this month' }}
            className="hover:shadow-lg transition-shadow duration-300"
          />
          <DataCard
            title="Data Points Analyzed"
            value="1.2M+"
            subtitle="Since inception"
            icon="📈"
            trend={{ value: 8.5, label: 'growth rate' }}
            className="hover:shadow-lg transition-shadow duration-300"
          />
          <DataCard
            title="Research Publications"
            value="89"
            subtitle="Citations available"
            icon="📚"
            trend={{ value: 15, label: 'this year' }}
            className="hover:shadow-lg transition-shadow duration-300"
          />
        </div>

        {/* Research Tools Grid */}
        <div className="mb-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-dark mb-2">Research Tools</h2>
            <p className="text-gray-600">Select a tool to begin your analysis</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {researchTools.map((tool, index) => (
              tool.enabled ? (
                <Link key={index} to={tool.path}>
                  <div className={`bg-gradient-to-br ${tool.gradient} ${tool.hoverGradient}
                                  rounded-xl p-6 text-white
                                  transform transition-all duration-300
                                  hover:scale-105 hover:shadow-xl
                                  cursor-pointer h-full`}>
                    <div className="text-4xl mb-3">{tool.emoji}</div>
                    <h3 className="text-xl font-bold mb-2">{tool.title}</h3>
                    <p className={`${tool.textColor} mb-4 text-sm leading-relaxed`}>
                      {tool.description}
                    </p>
                    <div className="flex items-center text-sm font-medium mt-auto">
                      Open Tool
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ) : (
                <div key={index} className={`bg-gradient-to-br ${tool.gradient}
                                             rounded-xl p-6 text-white
                                             opacity-75 cursor-not-allowed h-full`}>
                  <div className="text-4xl mb-3">{tool.emoji}</div>
                  <h3 className="text-xl font-bold mb-2">{tool.title}</h3>
                  <p className={`${tool.textColor} mb-4 text-sm leading-relaxed whitespace-pre-line`}>
                    {tool.description}
                  </p>
                  <div className="flex items-center text-sm font-medium mt-auto opacity-60">
                    Stay Tuned
                  </div>
                </div>
              )
            ))}
          </div>
        </div>

        {/* Recent Activity & Resources */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-2">📊</span>
              <h3 className="text-xl font-semibold text-dark">Recent Research Activity</h3>
            </div>
            <div className="space-y-4">
              {recentActivity.map((item, index) => (
                <div key={index} className="flex items-start p-3 rounded-lg bg-gray-50 hover:bg-blue-50 transition-colors duration-200">
                  <span className="text-2xl mr-3">{item.icon}</span>
                  <div className="flex-1">
                    <p className="text-dark font-medium text-sm">{item.activity}</p>
                    <p className="text-gray-500 text-xs mt-1">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button className="text-primary hover:text-blue-700 text-sm font-medium transition-colors">
                View All Activity →
              </button>
            </div>
          </div>

          {/* Resources Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-2">📚</span>
              <h3 className="text-xl font-semibold text-dark">Research Resources</h3>
            </div>
            <div className="space-y-3">
              {resources.map((resource, index) => (
                <div key={index} className="flex items-center p-3 rounded-lg bg-gray-50 hover:bg-green-50 transition-colors duration-200 group cursor-pointer">
                  <svg className="w-5 h-5 text-secondary mr-3 group-hover:text-green-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-dark text-sm group-hover:text-secondary transition-colors">
                    {resource}
                  </span>
                  {resource.includes('Coming Soon') && (
                    <span className="ml-auto text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                      Soon
                    </span>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button className="text-secondary hover:text-green-700 text-sm font-medium transition-colors">
                Browse All Resources →
              </button>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="mt-8 bg-gradient-to-r from-primary to-secondary rounded-xl p-6 text-white">
          <div className="flex items-start">
            <div className="text-3xl mr-4">💡</div>
            <div>
              <h3 className="text-lg font-semibold mb-2">New to the Researcher Workspace?</h3>
              <p className="text-blue-100 text-sm mb-3">
                Our research tools are designed to help you analyze groundwater data effectively.
                Start with the Station Comparison Lab to compare trends, or use the Recharge Event Tracker
                to identify rainfall-driven groundwater replenishment.
              </p>
              <button className="bg-white text-primary px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-50 transition-colors">
                View Quick Start Guide
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResearcherHub;
