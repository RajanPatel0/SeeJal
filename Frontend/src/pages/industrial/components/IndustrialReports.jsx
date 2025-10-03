// src/pages/industrial/components/IndustrialReports.jsx
import React, { useState } from 'react';
import { 
  Download, 
  FileText, 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  Calendar,
  MapPin,
  Printer,
  Share2,
  Eye,
  CheckCircle,
  Clock,
  FileSpreadsheet,
  FilePieChart,
  X,
  ExternalLink
} from 'lucide-react';

const IndustrialReports = ({ location }) => {
  const [selectedReport, setSelectedReport] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [viewingReport, setViewingReport] = useState(null);

  // Enhanced report templates with proper content structure
  const reportTemplates = [
    {
      id: 'comprehensive',
      name: 'Comprehensive Water Risk Assessment',
      description: 'Complete analysis of water security, risks, and recommendations',
      icon: FileText,
      color: 'blue',
      estimatedTime: '2-3 minutes',
      fileType: 'PDF',
      size: '2.5 MB',
      sections: [
        'Executive Summary',
        'Water Security Analysis',
        'Risk Assessment',
        'Recommendations',
        'Compliance Status'
      ]
    },
    {
      id: 'monthly',
      name: 'Monthly Water Usage Report',
      description: 'Detailed monthly extraction, usage patterns and compliance',
      icon: BarChart3,
      color: 'green',
      estimatedTime: '1-2 minutes',
      fileType: 'PDF',
      size: '1.8 MB',
      sections: [
        'Monthly Overview',
        'Usage Statistics',
        'Extraction Data',
        'Compliance Metrics',
        'Trend Analysis'
      ]
    },
    {
      id: 'sustainability',
      name: 'Sustainability & Compliance Report',
      description: 'Environmental impact and regulatory compliance assessment',
      icon: CheckCircle,
      color: 'emerald',
      estimatedTime: '1 minute',
      fileType: 'PDF',
      size: '1.2 MB',
      sections: [
        'Environmental Impact',
        'Compliance Status',
        'Sustainability Metrics',
        'Improvement Areas'
      ]
    },
    {
      id: 'forecast',
      name: '6-Month Water Forecast',
      description: 'Predictive analysis and cost projections',
      icon: TrendingUp,
      color: 'purple',
      estimatedTime: '30 seconds',
      fileType: 'PDF',
      size: '0.9 MB',
      sections: [
        'Forecast Overview',
        'Usage Projections',
        'Cost Analysis',
        'Risk Factors'
      ]
    },
    {
      id: 'risk',
      name: 'Water Risk Analysis',
      description: 'Critical risk factors and mitigation strategies',
      icon: AlertTriangle,
      color: 'orange',
      estimatedTime: '1-2 minutes',
      fileType: 'PDF',
      size: '1.5 MB',
      sections: [
        'Risk Identification',
        'Impact Analysis',
        'Mitigation Strategies',
        'Action Plan'
      ]
    },
    {
      id: 'extraction',
      name: 'Extraction Planning Data',
      description: 'Raw data for pumping optimization and scheduling',
      icon: FileSpreadsheet,
      color: 'indigo',
      estimatedTime: '45 seconds',
      fileType: 'Excel',
      size: '3.2 MB',
      sections: [
        'Extraction Data',
        'Pumping Schedule',
        'Optimization Parameters',
        'Performance Metrics'
      ]
    }
  ];

  // Enhanced recent reports with proper PDF content
  const [recentReports, setRecentReports] = useState([
    {
      id: 'report_001',
      name: 'January 2024 Water Assessment',
      type: 'monthly',
      generated: '2024-01-31',
      size: '1.8 MB',
      status: 'completed',
      template: 'monthly',
      content: {
        title: 'January 2024 Water Assessment Report',
        location: location.name,
        date: 'January 31, 2024',
        executiveSummary: 'This comprehensive water assessment analyzes current water usage patterns, extraction rates, and sustainability metrics for the industrial park.',
        keyFindings: [
          'Total Water Consumption: 2.5 million liters/day',
          'Groundwater Extraction: 65% of total usage',
          'Recycling Efficiency: 42%',
          'Compliance Status: Fully Compliant'
        ],
        recommendations: [
          'Implement advanced water recycling systems',
          'Optimize pumping schedules during off-peak hours',
          'Conduct monthly pipe leak detection audits'
        ],
        charts: ['usage_trends', 'extraction_patterns', 'compliance_metrics']
      }
    },
    {
      id: 'report_002',
      name: 'Q4 2023 Sustainability Report',
      type: 'sustainability',
      generated: '2024-01-15',
      size: '2.1 MB',
      status: 'completed',
      template: 'sustainability',
      content: {
        title: 'Q4 2023 Sustainability Report',
        location: location.name,
        date: 'January 15, 2024',
        executiveSummary: 'Environmental performance and compliance assessment for Q4 2023.',
        keyFindings: [
          'Carbon Footprint Reduction: 15% YoY',
          'Water Recycling Rate: 45%',
          'Energy Efficiency: Improved by 22%'
        ],
        compliance: [
          'All environmental standards met',
          'Zero regulatory violations',
          '100% reporting compliance'
        ],
        charts: ['sustainability_metrics', 'compliance_trends']
      }
    },
    {
      id: 'report_003',
      name: 'Annual Water Risk Review 2023',
      type: 'comprehensive',
      generated: '2024-01-05',
      size: '3.2 MB',
      status: 'completed',
      template: 'comprehensive',
      content: {
        title: 'Annual Water Risk Review 2023',
        location: location.name,
        date: 'January 5, 2024',
        executiveSummary: 'Comprehensive risk assessment identifying potential water-related challenges and mitigation strategies.',
        riskAssessment: {
          high: ['Groundwater depletion', 'Seasonal variability'],
          medium: ['Infrastructure maintenance', 'Regulatory changes'],
          low: ['Water quality', 'Supply chain disruptions']
        },
        mitigation: [
          'Diversify water sources',
          'Implement real-time monitoring',
          'Enhance storage capacity'
        ],
        charts: ['risk_matrix', 'mitigation_impact']
      }
    }
  ]);

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600 border-blue-200',
      green: 'bg-green-50 text-green-600 border-green-200',
      emerald: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      purple: 'bg-purple-50 text-purple-600 border-purple-200',
      orange: 'bg-orange-50 text-orange-600 border-orange-200',
      indigo: 'bg-indigo-50 text-indigo-600 border-indigo-200'
    };
    return colors[color] || colors.blue;
  };

  // Create a proper PDF content
  const createPDFContent = (reportType, content) => {
    const pdfContent = `
%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj
2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj
3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
/Font <<
/F1 5 0 R
>>
>>
>>
endobj
4 0 obj
<<
/Length 500
>>
stream
BT
/F1 12 Tf
50 750 Td
(${reportType.name} - ${location.name}) Tj
0 -20 Td
(Generated on: ${new Date().toLocaleDateString()}) Tj
0 -40 Td
(Report Content:) Tj
0 -20 Td
(${JSON.stringify(content, null, 2)}) Tj
ET
endstream
endobj
5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000125 00000 n 
0000000250 00000 n 
0000000450 00000 n 
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
600
%%EOF
    `;
    return pdfContent;
  };

  const generateReport = async (reportType) => {
    setIsGenerating(true);
    setSelectedReport(reportType);
    
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Create report content based on template
    const reportContent = {
      title: reportType.name,
      location: location.name,
      date: new Date().toLocaleDateString(),
      sections: reportType.sections,
      summary: `Automatically generated ${reportType.name} for ${location.name}`,
      data: {
        usage: Math.random() * 1000000,
        efficiency: Math.random() * 100,
        compliance: Math.random() * 100
      }
    };

    // Create proper PDF blob
    const pdfContent = createPDFContent(reportType, reportContent);
    const blob = new Blob([pdfContent], { 
      type: 'application/pdf' 
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${reportType.name.replace(/\s+/g, '_')}_${location.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    // Add to recent reports
    const newReport = {
      id: `report_${Date.now()}`,
      name: `${reportType.name} - ${new Date().toLocaleDateString()}`,
      type: reportType.id,
      generated: new Date().toISOString().split('T')[0],
      size: reportType.size,
      status: 'completed',
      template: reportType.id,
      content: reportContent
    };
    
    setRecentReports(prev => [newReport, ...prev.slice(0, 2)]);
    setIsGenerating(false);
  };

  const viewReport = (report) => {
    setViewingReport(report);
  };
  
  const downloadReport = (report) => {
    const reportType = reportTemplates.find(t => t.id === report.template) || reportTemplates[0];
    const pdfContent = createPDFContent(reportType, report.content);
    
    const blob = new Blob([pdfContent], { 
      type: 'application/pdf' 
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${report.name.replace(/\s+/g, '_')}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleGenerateFromHeader = () => {
    const defaultReport = reportTemplates[0];
    generateReport(defaultReport);
  };

  const closeReportViewer = () => {
    setViewingReport(null);
  };

  // Render report content in a structured way
  const renderReportContent = (report) => {
    const content = report.content;
    
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center border-b pb-4">
          <h1 className="text-2xl font-bold text-gray-900">{content.title}</h1>
          <p className="text-gray-600 mt-2">{content.location}</p>
          <p className="text-gray-500 text-sm">Generated: {content.date}</p>
        </div>

        {/* Executive Summary */}
        {content.executiveSummary && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Executive Summary</h2>
            <p className="text-gray-700 leading-relaxed">{content.executiveSummary}</p>
          </div>
        )}

        {/* Key Findings */}
        {content.keyFindings && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Key Findings</h2>
            <ul className="space-y-2">
              {content.keyFindings.map((finding, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{finding}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Risk Assessment */}
        {content.riskAssessment && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Risk Assessment</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(content.riskAssessment).map(([level, risks]) => (
                <div key={level} className="border rounded-lg p-4">
                  <h3 className={`font-semibold capitalize ${
                    level === 'high' ? 'text-red-600' : 
                    level === 'medium' ? 'text-orange-600' : 'text-green-600'
                  }`}>
                    {level} Risk
                  </h3>
                  <ul className="mt-2 space-y-1">
                    {risks.map((risk, index) => (
                      <li key={index} className="text-sm text-gray-700">• {risk}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {content.recommendations && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Recommendations</h2>
            <div className="space-y-3">
              {content.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start p-3 bg-blue-50 rounded-lg">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 flex-shrink-0">
                    {index + 1}
                  </span>
                  <span className="text-gray-700">{recommendation}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Compliance */}
        {content.compliance && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Compliance Status</h2>
            <ul className="space-y-2">
              {content.compliance.map((item, index) => (
                <li key={index} className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Mitigation Strategies */}
        {content.mitigation && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Mitigation Strategies</h2>
            <ul className="space-y-2">
              {content.mitigation.map((strategy, index) => (
                <li key={index} className="flex items-start">
                  <TrendingUp className="w-5 h-5 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{strategy}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Report Generation Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Generate Water Reports</h2>
            <p className="text-gray-600 mt-1">
              Create comprehensive water management reports for {location.name}
            </p>
          </div>
          <button
            onClick={handleGenerateFromHeader}
            disabled={isGenerating}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg transition-colors font-medium flex items-center"
          >
            {isGenerating ? (
              <>
                <Clock className="w-5 h-5 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="w-5 h-5 mr-2" />
                Generate Quick Report
              </>
            )}
          </button>
        </div>

        {/* Report Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reportTemplates.map((report) => {
            const Icon = report.icon;
            return (
              <div
                key={report.id}
                className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-all duration-300 hover:border-blue-300 cursor-pointer group"
                onClick={() => generateReport(report)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg ${getColorClasses(report.color)}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {report.fileType}
                  </span>
                </div>
                
                <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                  {report.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {report.description}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {report.estimatedTime}
                  </div>
                  <div>
                    {report.size}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Report Preview/Generation Status */}
      {selectedReport && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Report Generation</h3>
            {!isGenerating && (
              <div className="flex items-center space-x-2">
                <button className="flex items-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </button>
                <button className="flex items-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <div>
                  <p className="font-medium text-blue-800">Generating {selectedReport.name}</p>
                  <p className="text-sm text-blue-600">This may take a few moments...</p>
                </div>
              </>
            ) : (
              <>
                <CheckCircle className="w-8 h-8 text-green-500" />
                <div>
                  <p className="font-medium text-green-800">Report Generated Successfully!</p>
                  <p className="text-sm text-green-600">
                    Your {selectedReport.name} has been downloaded.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Recent Reports */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Recent Reports</h3>
        
        <div className="space-y-4">
          {recentReports.map((report) => (
            <div key={report.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-4">
                <FileText className="w-8 h-8 text-gray-400" />
                <div>
                  <h4 className="font-medium text-gray-800">{report.name}</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                    <span>Generated: {new Date(report.generated).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{report.size}</span>
                    <span>•</span>
                    <span className="flex items-center text-green-600">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Completed
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button 
                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors" 
                  title="View"
                  onClick={() => viewReport(report)}
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button 
                  className="p-2 text-gray-400 hover:text-green-600 transition-colors" 
                  title="Download"
                  onClick={() => downloadReport(report)}
                >
                  <Download className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-purple-600 transition-colors" title="Share">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Report Viewer Modal */}
      {viewingReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
              <div className="flex items-center space-x-3">
                <FileText className="w-6 h-6 text-blue-600" />
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{viewingReport.name}</h3>
                  <p className="text-sm text-gray-600">
                    Generated on {new Date(viewingReport.generated).toLocaleDateString()} • {viewingReport.size}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => downloadReport(viewingReport)}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </button>
                <button 
                  onClick={closeReportViewer}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              <div className="p-8">
                <div className="max-w-4xl mx-auto">
                  {renderReportContent(viewingReport)}
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>Report ID: {viewingReport.id}</span>
                <span>{location.name} • Water Management System</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Report Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
          <BarChart3 className="w-8 h-8 text-blue-600 mb-3" />
          <h4 className="font-semibold text-blue-800 mb-2">Comprehensive Analytics</h4>
          <p className="text-blue-700 text-sm">
            Detailed water level trends, recharge patterns, and consumption analytics with interactive charts.
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
          <TrendingUp className="w-8 h-8 text-green-600 mb-3" />
          <h4 className="font-semibold text-green-800 mb-2">Predictive Insights</h4>
          <p className="text-green-700 text-sm">
            AI-powered forecasts and cost projections for better water management planning.
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
          <AlertTriangle className="w-8 h-8 text-purple-600 mb-3" />
          <h4 className="font-semibold text-purple-800 mb-2">Risk Assessment</h4>
          <p className="text-purple-700 text-sm">
            Identify potential risks and get actionable recommendations for sustainable water usage.
          </p>
        </div>
      </div>
    </div>
  );
};

export default IndustrialReports;