import * as React from 'react';
import { Bar } from 'react-chartjs-2';

import { AppStore } from '../../hooks/useTimeStore';
import { getTotalDailyActivity } from '../../selectors/get-total-daily-activity';
import {
  getHoursInMs,
  getIsoDate,
  getTimeFromMs,
} from '../../shared/dates-helper';

import { Panel } from '../Panel/Panel';

const BAR_OPTIONS = {
  responsive: true,
  scales: {
    y: {
      max: 12,
      ticks: {
        callback: (value: string) => {
          return parseInt(value) + 'h';
        },
      },
    },
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        title: ([item]: any) => {
          return `${item?.label}`;
        },
        label: (item: any) => {
          return (
            ' ' +
            getTimeFromMs(Number(item.formattedValue || 0) * getHoursInMs(1))
          );
        },
      },
    },
  },
};

export const WeeklyWebsiteActivityChart: React.FC<{
  store: AppStore;
  weekEndDate: string;
}> = ({ store, weekEndDate }) => {
  const endDate = new Date(weekEndDate);
  const { data, labels } = new Array(7).fill(0).reduce(
    (acc, _, index) => {
      endDate.setDate(endDate.getDate() - Number(index > 0));

      const isoDate = getIsoDate(endDate);

      acc.labels.push(isoDate);

      const usageTime = getTotalDailyActivity(store, endDate);
      acc.data.push(usageTime / getHoursInMs(1));

      return acc;
    },
    {
      data: [],
      labels: [],
    }
  );

  const chartData = {
    labels: labels.reverse(),
    datasets: [
      {
        label: 'Weekly activity',
        data: data.reverse(),
        backgroundColor: '#dfdfff',
      },
    ],
  };
  return (
    <Panel header={<>{`${labels[0]} - ${labels[labels.length - 1]}`}</>}>
      <Bar options={BAR_OPTIONS} data={chartData} />
    </Panel>
  );
};
