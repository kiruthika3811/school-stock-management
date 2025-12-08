import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatsCard = ({ title, value, icon: Icon, trend, trendValue, color = 'primary' }) => {
  const colorClasses = {
    primary: 'bg-blue-100 text-blue-600',
    success: 'bg-green-100 text-green-600',
    warning: 'bg-amber-100 text-amber-600',
    danger: 'bg-red-100 text-red-600',
    purple: 'bg-purple-100 text-purple-600'
  };

  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-gray-500 text-xs sm:text-sm font-medium mb-1">{title}</p>
          <h3 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">{value}</h3>
          
          {trend && (
            <div className="flex items-center gap-1 flex-wrap">
              {trend === 'up' ? (
                <TrendingUp size={14} className="text-success sm:w-4 sm:h-4" />
              ) : (
                <TrendingDown size={14} className="text-danger sm:w-4 sm:h-4" />
              )}
              <span className={`text-xs sm:text-sm font-medium ${trend === 'up' ? 'text-success' : 'text-danger'}`}>
                {trendValue}
              </span>
              <span className="text-xs sm:text-sm text-gray-500">vs last month</span>
            </div>
          )}
        </div>
        
        <div className={`p-2 sm:p-3 rounded-xl ${colorClasses[color]} flex-shrink-0`}>
          <Icon size={20} className="sm:w-6 sm:h-6" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
