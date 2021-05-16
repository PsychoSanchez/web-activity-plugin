import * as React from 'react';

import { Doughnut } from 'react-chartjs-2';

const DOUGHNUT_CHART_OPTIONS = {
  responsive: true,
  animation: false,
  plugins: {
    legend: {
      position: 'left',
    },
  },
};

const ITEMS_TO_DISPLAY = 5;
const ITEMS_COLORS = [
  '#063f3e',
  '#165b44',
  '#30884e',
  '#4ca657',
  '#79c365',
  '#c4ea99',
];

interface DailyUsageChartProps {
  date: string;
  activity: Record<string, number>;
}

const buildChartDataFromActivity = ({
  date,
  activity,
}: DailyUsageChartProps) => {
  const entriesByDesc = Object.entries(activity).sort(
    ([_, value1], [_2, value2]) => {
      return value2 - value1;
    }
  );

  const itemsToDisplay = entriesByDesc.splice(0, ITEMS_TO_DISPLAY);
  if (entriesByDesc.length > 0) {
    const restActivityTime = entriesByDesc.reduce(
      (acc, [_, value]) => acc + value,
      0
    );

    itemsToDisplay.push(['Other pages', restActivityTime]);
  }

  const labels = itemsToDisplay.map(([key]) => key);
  const data = itemsToDisplay.map(([_, value]) => Math.floor(value / 1000));

  return {
    labels,
    datasets: [
      {
        label: date,
        data,
        backgroundColor: ITEMS_COLORS,
      },
    ],
  };
};

export const DailyUsageChart: React.FC<DailyUsageChartProps> = (props) => {
  const data = buildChartDataFromActivity(props);

  return <Doughnut options={DOUGHNUT_CHART_OPTIONS} data={data}></Doughnut>;
};
