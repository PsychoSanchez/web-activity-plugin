import * as React from 'react';
import { Bar } from 'react-chartjs-2';

import { getTotalDailyActivity } from '../../selectors/get-total-daily-activity';
import {
  get7DaysPriorDate,
  getHoursInMs,
  getIsoDate,
  getTimeFromMs,
} from '../../shared/dates-helper';

import { Panel } from '../Panel/Panel';

import { WeeklyWebsiteActivityChartProps } from './types';

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

const HOUR_IN_MS = getHoursInMs(1);

export const WeeklyWebsiteActivityChart: React.FC<WeeklyWebsiteActivityChartProps> =
  ({ store, sundayDate }) => {
    const week = get7DaysPriorDate(sundayDate).reverse();
    const labels = week.map((date) => getIsoDate(date));
    const data = week.map(
      (date) => getTotalDailyActivity(store, date) / HOUR_IN_MS
    );

    const chartData = {
      labels: labels,
      datasets: [
        {
          label: 'Weekly activity',
          data: data,
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
