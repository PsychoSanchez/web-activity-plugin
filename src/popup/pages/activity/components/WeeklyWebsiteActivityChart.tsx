import { BarChartHorizontal } from 'lucide-react';
import * as React from 'react';

import { Bar, ChartOptions } from '@shared/libs/ChartJs';
import { i18n } from '@shared/services/i18n';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card';
import {
  generatePrior7DaysDates,
  getHoursInMs,
  getIsoDate,
  getTimeFromMs,
  getTimeWithoutSeconds,
} from '@shared/utils/date';
import { getTotalDailyActivity } from '@shared/utils/time-store';

import { useIsDarkMode } from '@popup/hooks/useTheme';
import { TimeStore } from '@popup/hooks/useTimeStore';

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
        title: ([item]) => {
          return `${item?.label}`;
        },
        label: (item) => {
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

    return [
      week.map((date) => getIsoDate(date)),
      week.map((date) => getTotalDailyActivity(store, date) / HOUR_IN_MS),
    ];
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
          label: i18n('WeeklyWebsiteActivityChart_ChartLabel'),
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
    <Card>
      <CardHeader>
        <CardTitle className="flex gap-2">
          <BarChartHorizontal size={16} />
          {presentChartTitle?.(weekName) ?? weekName}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Bar
          options={isDarkMode ? DARK_MODE_BAR_OPTIONS : BAR_OPTIONS}
          data={chartData}
        />
      </CardContent>
    </Card>
  );
};
