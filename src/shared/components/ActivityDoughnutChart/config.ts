import { ChartOptions } from '@shared/libs/ChartJs';
import { getMinutesInMs } from '@shared/utils/date';

export const ONE_MINUTE = getMinutesInMs(1);
export const MAX_ITEMS_TO_DISPLAY = 5;
export const ITEMS_COLORS = [
  '#ffa600',
  '#f97144',
  '#d44d63',
  '#9a3f70',
  '#5a3764',
  '#262944',
];

export const ACTIVITY_DOUGHNUT_CHART_OPTIONS = {
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
        title: ([item]) => {
          return `${item?.label}`;
        },
        label: (item) => {
          return ` ${item.formattedValue}%`;
        },
      },
    },
  },
} satisfies ChartOptions<'doughnut'>;

export const DARK_MODE_ACTIVITY_DOUGHNUT_CHART_OPTIONS = {
  ...ACTIVITY_DOUGHNUT_CHART_OPTIONS,
  plugins: {
    ...ACTIVITY_DOUGHNUT_CHART_OPTIONS.plugins,
    legend: {
      ...ACTIVITY_DOUGHNUT_CHART_OPTIONS.plugins.legend,
      labels: {
        ...ACTIVITY_DOUGHNUT_CHART_OPTIONS.plugins.legend.labels,
        color: '#e5e5e5',
      },
    },
  },
} satisfies ChartOptions<'doughnut'>;
