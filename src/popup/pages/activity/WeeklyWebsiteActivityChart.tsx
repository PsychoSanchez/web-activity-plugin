import * as React from 'react';

import { Icon, IconType } from '@shared/blocks/Icon';
import { Panel, PanelHeader } from '@shared/blocks/Panel';
import { Bar, ChartOptions } from '@shared/libs/ChartJs';
import {
  generatePrior7DaysDates,
  getHoursInMs,
  getIsoDate,
  getTimeFromMs,
  getTimeWithoutSeconds,
} from '@shared/utils/date';
import { getTotalDailyActivity } from '@shared/utils/time-store';

import { useIsDarkMode } from '../../hooks/useTheme';
import { TimeStore } from '../../hooks/useTimeStore';

export interface WeeklyWebsiteActivityChartProps {
  store: TimeStore;
  sundayDate: Date;
  presentChartTitle?: (weekName: string) => string;
}

const HOUR_IN_MS = getHoursInMs(1);

const BAR_OPTIONS = {
  responsive: true,
  scales: {
    y: {
      ticks: {
        color: '#222',
        callback: (value) => {
          return getTimeWithoutSeconds(Number(value) * HOUR_IN_MS);
        },
      },
    },
    x: {
      ticks: {
        color: '#222',
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
} satisfies ChartOptions<'bar'>;

const DARK_MODE_BAR_OPTIONS = {
  ...BAR_OPTIONS,
  scales: {
    ...BAR_OPTIONS.scales,
    y: {
      ...BAR_OPTIONS.scales.y,
      ticks: {
        ...BAR_OPTIONS.scales.y.ticks,
        color: '#e5e5e5',
      },
      grid: {
        color: '#444444',
      },
    },
    x: {
      ...BAR_OPTIONS.scales.x,
      ticks: {
        ...BAR_OPTIONS.scales.x.ticks,
        color: '#e5e5e5',
      },
      grid: {
        color: '#444444',
      },
    },
  },
} satisfies ChartOptions<'bar'>;

export const WeeklyWebsiteActivityChart: React.FC<
  WeeklyWebsiteActivityChartProps
> = ({ store, sundayDate, presentChartTitle }) => {
  const isDarkMode = useIsDarkMode();

  const [labels, data] = React.useMemo(() => {
    const week = generatePrior7DaysDates(sundayDate).reverse();
    const labels = week.map((date) => getIsoDate(date));
    const data = week.map(
      (date) => getTotalDailyActivity(store, date) / HOUR_IN_MS,
    );

    return [labels, data];
  }, [store, sundayDate]);

  const weekName = React.useMemo(
    () => `${labels[0]} - ${labels[labels.length - 1]}`,
    [labels],
  );

  const chartData = React.useMemo(
    () => ({
      labels: labels,
      datasets: [
        {
          label: 'Weekly activity',
          data: data,
          backgroundColor: '#4b76e3',
          borderRadius: 12,
          borderSkipped: false,
        },
      ],
    }),
    [labels, data],
  );

  return (
    <Panel>
      <PanelHeader>
        <Icon type={IconType.ChartHistogram} />
        {presentChartTitle?.(weekName) ?? weekName}
      </PanelHeader>
      <Bar
        options={isDarkMode ? DARK_MODE_BAR_OPTIONS : BAR_OPTIONS}
        data={chartData}
      />
    </Panel>
  );
};
