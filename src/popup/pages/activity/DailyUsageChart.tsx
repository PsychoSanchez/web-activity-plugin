import * as React from 'react';
import { Doughnut } from 'react-chartjs-2';

import {
  getMinutesInMs,
  getTimeWithoutSeconds,
} from '@shared/utils/dates-helper';

import { useIsDarkMode } from '../../hooks/useTheme';

export interface DailyUsageChartProps {
  date: string;
  activity: Record<string, number>;
  totalDailyActivity: number;
}

const DOUGHNUT_CHART_OPTIONS = {
  responsive: true,
  plugins: {
    legend: {
      position: 'left',
      labels: {
        color: '#222',
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

const DARK_MODE_DOUGHNUT_CHART_OPTIONS = {
  ...DOUGHNUT_CHART_OPTIONS,
  plugins: {
    ...DOUGHNUT_CHART_OPTIONS.plugins,
    legend: {
      ...DOUGHNUT_CHART_OPTIONS.plugins.legend,
      labels: {
        ...DOUGHNUT_CHART_OPTIONS.plugins.legend.labels,
        color: '#e5e5e5',
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
const ONE_MINUTE = getMinutesInMs(1);

const presentChartLabel = (key: string, value: number) => {
  const timeString = value > ONE_MINUTE ? getTimeWithoutSeconds(value) : '<1m';
  const label = `${key} (${timeString})`;

  return label;
};

const buildChartDataFromActivity = ({
  date,
  activity,
  totalDailyActivity,
}: DailyUsageChartProps) => {
  const entriesByDesc = Object.entries(activity).sort(
    ([, value1], [, value2]) => {
      return value2 - value1;
    },
  );

  const itemsToDisplay = entriesByDesc.splice(0, ITEMS_TO_DISPLAY);
  if (entriesByDesc.length > 0) {
    const restActivityTime = entriesByDesc.reduce(
      (acc, [_, value]) => acc + value,
      0,
    );

    itemsToDisplay.push(['Other pages', restActivityTime]);
  }

  const labels = itemsToDisplay.map(([key, value]) =>
    presentChartLabel(key, value),
  );
  const data = itemsToDisplay.map(([_, value]) =>
    Math.floor((value / totalDailyActivity) * 100),
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

export const DailyUsageChart: React.FC<DailyUsageChartProps> = ({
  activity,
  date,
  totalDailyActivity,
}) => {
  const isDarkMode = useIsDarkMode();
  const data = React.useMemo(
    () => buildChartDataFromActivity({ activity, date, totalDailyActivity }),
    [activity, date, totalDailyActivity],
  );

  return (
    <Doughnut
      options={
        isDarkMode ? DARK_MODE_DOUGHNUT_CHART_OPTIONS : DOUGHNUT_CHART_OPTIONS
      }
      data={data}
    />
  );
};
