import React from 'react';
import { useTranslation } from 'react-i18next';

const StatusIndicator = ({ status, size = 'medium' }) => {
  const { t } = useTranslation();
  
  const getStatusConfig = () => {
    switch (status) {
      case 'safe':
        return { color: 'bg-green-500', text: t('safe') };
      case 'semi-critical':
        return { color: 'bg-yellow-500', text: t('semi_critical') };
      case 'critical':
        return { color: 'bg-red-500', text: t('critical') };
      default:
        return { color: 'bg-gray-500', text: 'Unknown' };
    }
  };

  const sizeClasses = {
    small: 'w-2 h-2',
    medium: 'w-3 h-3',
    large: 'w-4 h-4'
  };

  const config = getStatusConfig();

  return (
    <div className="flex items-center space-x-2">
      <div className={`${sizeClasses[size]} ${config.color} rounded-full`}></div>
      <span className="text-sm font-medium">{config.text}</span>
    </div>
  );
};

export default StatusIndicator;