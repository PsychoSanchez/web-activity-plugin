export const TIMELINE_CHART_LIGHT_THEME_OPTIONS = {
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

export const TIMELINE_CHART_DARK_THEME_OPTIONS = {
  ...TIMELINE_CHART_LIGHT_THEME_OPTIONS,
  scales: {
    ...TIMELINE_CHART_LIGHT_THEME_OPTIONS.scales,
    x: {
      ...TIMELINE_CHART_LIGHT_THEME_OPTIONS.scales.x,
      ticks: {
        ...TIMELINE_CHART_LIGHT_THEME_OPTIONS.scales.x.ticks,
        color: '#e5e5e5',
      },
      grid: {
        color: '#444444',
      },
    },
    y: {
      ...TIMELINE_CHART_LIGHT_THEME_OPTIONS.scales.y,
      ticks: {
        ...TIMELINE_CHART_LIGHT_THEME_OPTIONS.scales.y.ticks,
        color: '#e5e5e5',
      },
      grid: {
        color: '#444444',
      },
    },
  },
};
