import React from "react";

const Footer = () => {
  return (
    <footer className="bg-dark text-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mr-2">
                <span className="text-white font-bold text-sm">SJ</span>
              </div>
              <span className="text-xl font-bold">SeeJal</span>
            </div>
            <p className="text-gray-300 text-sm">
              Real-time groundwater monitoring and management system for
              sustainable water resources.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a
                  href="/dashboard"
                  className="hover:text-white transition-colors"
                >
                  Dashboard
                </a>
              </li>
              <li>
                <a
                  href="/analytics"
                  className="hover:text-white transition-colors"
                >
                  Analytics
                </a>
              </li>
              <li>
                <a
                  href="/reports"
                  className="hover:text-white transition-colors"
                >
                  Reports
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  API Access
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Data Sources
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>Email: info@seejal.gov.in</li>
              <li>Phone: +91-11-23456789</li>
              <li>CGWB, Ministry of Jal Shakti</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-600 mt-8 pt-6 text-center text-sm text-gray-300">
          <p>
            &copy; 2024 SeeJal - Central Ground Water Board. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
