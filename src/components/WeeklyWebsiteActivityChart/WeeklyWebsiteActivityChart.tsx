import * as React from 'react';
import { Bar } from 'react-chartjs-2';

import { getTotalDailyActivity } from '../../selectors/get-total-daily-activity';
import {
  get7DaysPriorDate,
  getHoursInMs,
  getIsoDate,
  getTimeFromMs,
  getTimeWithoutSeconds,
} from '../../shared/dates-helper';

import { Panel } from '../Panel/Panel';

import { WeeklyWebsiteActivityChartProps } from './types';

const HOUR_IN_MS = getHoursInMs(1);

const BAR_OPTIONS = {
  responsive: true,
  scales: {
    y: {
      ticks: {
        color: '#eaeaea',
        callback: (value: number) => {
          return getTimeWithoutSeconds(value * HOUR_IN_MS);
        },
      },
    },
    x: {
      ticks: {
        color: '#eaeaea',
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
            ' ' + getTimeFromMs(Number(item.formattedValue || 0) * HOUR_IN_MS)
          );
        },
      },
    },
  },
};

export const WeeklyWebsiteActivityChart: React.FC<WeeklyWebsiteActivityChartProps> =
  ({ store, sundayDate, presentChartTitle }) => {
    const week = get7DaysPriorDate(sundayDate).reverse();
    const labels = week.map((date) => getIsoDate(date));
    const data = week.map(
      (date) => getTotalDailyActivity(store, date) / HOUR_IN_MS
    );

    const weekName = `${labels[0]} - ${labels[labels.length - 1]}`;

    const chartData = {
      labels: labels,
      datasets: [
        {
          label: 'Weekly activity',
          data: data,
          backgroundColor: '#298f66',
        },
      ],
    };
    return (
      <Panel header={<>{presentChartTitle?.(weekName) ?? weekName}</>}>
        <Bar options={BAR_OPTIONS} data={chartData} />
      </Panel>
    );
  };
