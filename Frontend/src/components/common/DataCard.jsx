import React from 'react';

const DataCard = ({ title, value, subtitle, icon, trend, className = '' }) => {
  const getTrendColor = () => {
    if (trend?.value > 0) return 'text-green-600';
    if (trend?.value < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getTrendIcon = () => {
    if (trend?.value > 0) return '↗';
    if (trend?.value < 0) return '↘';
    return '→';
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-dark mb-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
        
        {icon && (
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
            <span className="text-white text-xl">{icon}</span>
          </div>
        )}
      </div>
      
      {trend && (
        <div className={`flex items-center mt-3 text-sm ${getTrendColor()}`}>
          <span className="font-semibold">{getTrendIcon()} {Math.abs(trend.value)}%</span>
          <span className="ml-1">{trend.label}</span>
        </div>
      )}
    </div>
  );
};

export default DataCard;