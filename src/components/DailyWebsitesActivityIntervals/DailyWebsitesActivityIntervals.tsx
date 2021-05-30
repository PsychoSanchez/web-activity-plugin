import * as React from 'react';
import { Bar } from 'react-chartjs-2';

// const config = {
//   type: 'bar',
//   data: data,
//   options: {
//     plugins: {
//       title: {
//         display: true,
//         text: 'Chart.js Bar Chart - Stacked',
//       },
//     },
//     responsive: true,
//     scales: {
//       x: {
//         stacked: true,
//       },
//     },
//   },
// };

export const DailyActivityTimelineChart: React.FC = () => {
  return (
    <div>
      <Bar />
    </div>
  );
};
