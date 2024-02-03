import * as React from 'react';
import { Bar } from 'react-chartjs-2';

import { TimelineRecord } from '@shared/db/types';

import { useIsDarkMode } from '../../../hooks/useTheme';
import {
  getChartTimeLabels,
  joinNeighborTimelineEvents,
  transformTimelineDataset,
} from './helpers';

export interface TimelineChartProps {
  timelineEvents: TimelineRecord[];
  emptyHoursMarginCount?: number;
}

const OPTIONS = {
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      display: false,
      callbacks: {
        title: (items: any[]) => {
          const totalActivityThisHour = items.reduce((acc, item) => {
            const { raw } = item;
            const [startMin = 0, endMin = 0] = raw;
            return acc + (endMin - startMin);
          }, 0);
          return `${totalActivityThisHour}m surfed between ${items[0].label}`;
        },
        label: () => void 0,
      },
    },
    title: {
      display: false,
    },
  },
  responsive: true,
  scales: {
    x: {
      stacked: true,
      ticks: {
        color: '#222222',
      },
    },
    y: {
      max: 60,
      min: 0,
      ticks: {
        color: '#222222',
        callback: (value: number) => {
          return `:${value.toString().padStart(2, '0')}`;
        },
      },
    },
  },
};

const DARK_OPTIONS = {
  ...OPTIONS,
  scales: {
    ...OPTIONS.scales,
    x: {
      ...OPTIONS.scales.x,
      ticks: {
        ...OPTIONS.scales.x.ticks,
        color: '#e5e5e5',
      },
      grid: {
        color: '#444444',
      },
    },
    y: {
      ...OPTIONS.scales.y,
      ticks: {
        ...OPTIONS.scales.y.ticks,
        color: '#e5e5e5',
      },
      grid: {
        color: '#444444',
      },
    },
  },
};

export const TimelineChart: React.FC<TimelineChartProps> = ({
  timelineEvents = [],
  emptyHoursMarginCount = 2,
}) => {
  const isDarkMode = useIsDarkMode();
  const joinedEvents = joinNeighborTimelineEvents(timelineEvents);
  const { chartDatasetData, timelineStartHour, timelineEndHour } =
    transformTimelineDataset(joinedEvents);
  const chartStartHour = Math.max(0, timelineStartHour - emptyHoursMarginCount);
  const chartEndHour = Math.min(23, timelineEndHour + emptyHoursMarginCount);

  const datasets = chartDatasetData.map((d, i) => ({
    label: 'dataset ' + i,
    data: d.slice(chartStartHour, chartEndHour + 1),
    backgroundColor: '#4b76e3',
    borderRadius: 8,
    borderSkipped: false,
  }));

  const chartData = {
    labels: getChartTimeLabels(chartStartHour, chartEndHour),
    datasets,
  };

  return <Bar options={isDarkMode ? DARK_OPTIONS : OPTIONS} data={chartData} />;
};
