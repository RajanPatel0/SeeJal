import React from 'react';
import { NavLink } from 'react-router-dom';

// The NavItem component now includes more sophisticated styling for animations
const NavItem = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `relative px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300 ease-in-out
       ${isActive 
         ? 'text-white' // Active link text color
         : 'text-gray-400 hover:text-white' // Inactive link text color and hover effect
       }`
    }
  >
    {({ isActive }) => (
      <>
        {children}
        {/* This span creates the animated underline for the active link */}
        {isActive && (
          <span
            className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400"
            style={{ transformOrigin: 'center' }}
            // A simple scale animation can be added with a bit more work if desired
          />
        )}
      </>
    )}
  </NavLink>
);

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-gray-800 to-gray-900 shadow-lg p-4 flex items-center justify-between z-20">
      
      {/* App Logo/Name with a subtle hover effect */}
      <h1 className="text-2xl font-bold text-white tracking-wider transition-transform duration-300 hover:scale-105">
        SeeJal
      </h1>
      
      {/* Navigation links */}
      <nav className="flex items-center space-x-6">
        <NavItem to="/">Map Dashboard</NavItem>
        <NavItem to="/research">Research</NavItem>
        <NavItem to="/reports">Reports</NavItem>
      </nav>

      {/* Login Button on the right */}
      <button className="bg-cyan-500 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-cyan-600 transition-all duration-300 ease-in-out transform hover:scale-105">
        Login
      </button>

    </header>
  );
}
