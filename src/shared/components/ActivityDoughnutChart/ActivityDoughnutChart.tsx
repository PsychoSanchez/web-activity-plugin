import React, { useMemo } from 'react';

import { ActivitySummaryByHostname } from '@shared/db/types';
import { Doughnut } from '@shared/libs/ChartJs';

import { ActivitySummaryByDate } from '@popup/services/time-store';

import {
  ACTIVITY_DOUGHNUT_CHART_OPTIONS,
  DARK_MODE_ACTIVITY_DOUGHNUT_CHART_OPTIONS,
  ITEMS_COLORS,
} from './config';
import { createActivityChartDataset } from './helper';

export interface DailyUsageChartProps {
  datasetLabel: string;
  activity: ActivitySummaryByHostname | ActivitySummaryByDate;
  isDarkMode: boolean;
}

export const ActivityDoughnutChart: React.FC<DailyUsageChartProps> = ({
  activity,
  datasetLabel,
  isDarkMode,
}) => {
  const chartData = useMemo(() => {
    const { labels, data } = createActivityChartDataset(activity);

    return {
      labels,
      datasets: [
        {
          label: datasetLabel,
          data,
          backgroundColor: ITEMS_COLORS,
        },
      ],
    };
  }, [activity, datasetLabel]);

  console.log(activity, chartData);

  return (
    <Doughnut
      options={
        isDarkMode
          ? DARK_MODE_ACTIVITY_DOUGHNUT_CHART_OPTIONS
          : ACTIVITY_DOUGHNUT_CHART_OPTIONS
      }
      data={chartData}
    />
  );
};
