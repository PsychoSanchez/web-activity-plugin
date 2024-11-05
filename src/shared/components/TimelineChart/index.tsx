import * as React from 'react';

import { TimelineRecord } from '@shared/db/types';
import { Bar } from '@shared/libs/ChartJs';

import {
  TIMELINE_CHART_DARK_THEME_OPTIONS,
  TIMELINE_CHART_LIGHT_THEME_OPTIONS,
} from './config';
import {
  getChartTimeLabels,
  joinNeighborTimelineEvents,
  transformTimelineDataset,
} from './helpers';

export interface TimelineChartProps {
  timelineEvents: TimelineRecord[];
  emptyHoursMarginCount?: number;
  isDarkMode?: boolean;
}

export const TimelineChart: React.FC<TimelineChartProps> = ({
  timelineEvents,
  emptyHoursMarginCount = 2,
  isDarkMode = false,
}) => {
  const joinedEvents = React.useMemo(
    () => joinNeighborTimelineEvents(timelineEvents),
    [timelineEvents],
  );
  const { chartDatasetData, timelineStartHour, timelineEndHour } =
    React.useMemo(() => transformTimelineDataset(joinedEvents), [joinedEvents]);

  const chartStartHour = Math.max(0, timelineStartHour - emptyHoursMarginCount);
  const chartEndHour = Math.min(23, timelineEndHour + emptyHoursMarginCount);

  const datasets = React.useMemo(() => {
    return chartDatasetData.map((d, i) => ({
      label: 'dataset ' + i,
      data: d.slice(chartStartHour, chartEndHour + 1),
      backgroundColor: '#4b76e3',
      borderRadius: 8,
      borderSkipped: false,
    }));
  }, [chartDatasetData, chartStartHour, chartEndHour]);

  const chartData = React.useMemo(
    () => ({
      labels: getChartTimeLabels(chartStartHour, chartEndHour),
      datasets,
    }),
    [chartStartHour, chartEndHour, datasets],
  );

  return (
    <Bar
      options={
        isDarkMode
          ? TIMELINE_CHART_DARK_THEME_OPTIONS
          : TIMELINE_CHART_LIGHT_THEME_OPTIONS
      }
      data={chartData}
    />
  );
};
