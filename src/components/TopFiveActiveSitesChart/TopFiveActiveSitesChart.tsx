import * as React from 'react';
import { Doughnut } from 'react-chartjs-2';

import { getTimeWithoutSeconds } from '../../shared/dates-helper';

import { DailyUsageChartProps } from './types';

const DOUGHNUT_CHART_OPTIONS = {
  responsive: true,
  plugins: {
    legend: {
      position: 'left',
      labels: {
        color: '#fff',
      },
    },
    tooltip: {
      callbacks: {
        title: ([item]: any) => {
          return `${item?.label}`;
        },
        label: (item: any) => {
          return ` ${item.formattedValue}%`;
        },
      },
    },
  },
};

const ITEMS_TO_DISPLAY = 5;
const ITEMS_COLORS = [
  '#ffa600',
  '#f97144',
  '#d44d63',
  '#9a3f70',
  '#5a3764',
  '#262944',
];

const buildChartDataFromActivity = ({
  date,
  activity,
  totalDailyActivity,
}: DailyUsageChartProps) => {
  const entriesByDesc = Object.entries(activity).sort(
    ([, value1], [, value2]) => {
      return value2 - value1;
    }
  );

  const itemsToDisplay = entriesByDesc.splice(0, ITEMS_TO_DISPLAY);
  if (entriesByDesc.length > 0) {
    const restActivityTime = entriesByDesc.reduce(
      (acc, [_, value]) => acc + value,
      0
    );

    itemsToDisplay.push(['Other pages', restActivityTime]);
  }

  const labels = itemsToDisplay.map(
    ([key, value]) => `${key} (${getTimeWithoutSeconds(value)})`
  );
  const data = itemsToDisplay.map(([_, value]) =>
    Math.floor((value / totalDailyActivity) * 100)
  );

  return {
    labels,
    datasets: [
      {
        label: date,
        data,
        backgroundColor: ITEMS_COLORS,
      },
    ],
  };
};

export const DailyUsageChart: React.FC<DailyUsageChartProps> = (props) => {
  const data = buildChartDataFromActivity(props);

  return <Doughnut options={DOUGHNUT_CHART_OPTIONS} data={data} />;
};
