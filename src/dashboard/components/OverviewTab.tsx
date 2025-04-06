import { BarChart, LineChart, Calendar, Clock, TrendingUp } from 'lucide-react';
import React from 'react';

export function OverviewTab() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Overview</h2>
      <p>
        Here you can see website usage in the past with panels and a date
        picker.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Activity Overview Panel */}
        <div className="p-4 rounded-lg border shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5" />
            <h3 className="font-medium">Activity Overview</h3>
          </div>
          {/* Add activity chart component here */}
        </div>

        {/* Popular Websites Panel */}
        <div className="p-4 rounded-lg border shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <BarChart className="w-5 h-5" />
            <h3 className="font-medium">Popular Websites</h3>
          </div>
          {/* Add popular websites list component here */}
        </div>

        {/* Weekly Patterns Panel */}
        <div className="p-4 rounded-lg border shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <LineChart className="w-5 h-5" />
            <h3 className="font-medium">Weekly Patterns</h3>
          </div>
          {/* Add weekly patterns chart component here */}
        </div>

        {/* Activity Hours Panel */}
        <div className="p-4 rounded-lg border shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-5 h-5" />
            <h3 className="font-medium">Activity Hours</h3>
          </div>
          {/* Add activity hours heatmap component here */}
        </div>

        {/* Calendar View Panel */}
        <div className="p-4 rounded-lg border shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-5 h-5" />
            <h3 className="font-medium">Monthly Overview</h3>
          </div>
          {/* Add calendar heatmap component here */}
        </div>
      </div>
    </div>
  );
}
