import React from 'react';

export const PerformanceChart = () => {
  const data = [
    { day: 'Mon', thisWeek: 85, lastWeek: 75 },
    { day: 'Tue', thisWeek: 92, lastWeek: 80 },
    { day: 'Wed', thisWeek: 78, lastWeek: 85 },
    { day: 'Thu', thisWeek: 95, lastWeek: 88 },
    { day: 'Fri', thisWeek: 89, lastWeek: 92 },
    { day: 'Sat', thisWeek: 75, lastWeek: 70 },
    { day: 'Sun', thisWeek: 82, lastWeek: 78 },
  ];

  const maxValue = Math.max(...data.flatMap(d => [d.thisWeek, d.lastWeek]));

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <span className="text-sm text-gray-600">This Week</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
            <span className="text-sm text-gray-600">Last Week</span>
          </div>
        </div>
        <div className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm">
          42% excellence
        </div>
      </div>

      <div className="relative h-64">
        <div className="absolute inset-0 flex items-end justify-between gap-2">
          {data.map((item, index) => (
            <div key={index} className="flex-1 flex items-end gap-1">
              <div
                className="flex-1 bg-yellow-400 rounded-t"
                style={{ height: `${(item.thisWeek / maxValue) * 100}%` }}
              ></div>
              <div
                className="flex-1 bg-red-400 rounded-t"
                style={{ height: `${(item.lastWeek / maxValue) * 100}%` }}
              ></div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mt-2">
        {data.map((item, index) => (
          <div key={index} className="text-center text-sm text-gray-600">
            {item.day}
          </div>
        ))}
      </div>
    </div>
  );
}; 