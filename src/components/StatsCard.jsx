import React from 'react';

export const StatsCard = ({ title, count, icon, color }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{count}</h3>
        </div>
        <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center text-xl`}>
          {icon}
        </div>
      </div>
    </div>
  );
}; 