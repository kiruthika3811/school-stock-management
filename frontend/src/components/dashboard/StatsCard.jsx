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
        <div className="flex-1">
          <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-3xl font-bold mb-2">{value}</h3>
          
          {trend && (
            <div className="flex items-center gap-1">
              {trend === 'up' ? (
                <TrendingUp size={16} className="text-success" />
              ) : (
                <TrendingDown size={16} className="text-danger" />
              )}
              <span className={`text-sm font-medium ${trend === 'up' ? 'text-success' : 'text-danger'}`}>
                {trendValue}
              </span>
              <span className="text-sm text-gray-500">vs last month</span>
            </div>
          )}
        </div>
        
        <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
