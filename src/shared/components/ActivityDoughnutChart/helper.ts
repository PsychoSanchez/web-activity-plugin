import { ActivitySummaryByHostname } from '@shared/db/types';
import { getTimeWithoutSeconds } from '@shared/utils/date';

import { ActivitySummaryByDate } from '@popup/services/time-store';

import { MAX_ITEMS_TO_DISPLAY, ONE_MINUTE } from './config';

const presentChartLabel = (key: string, value: number) => {
  const timeString = value > ONE_MINUTE ? getTimeWithoutSeconds(value) : '<1m';
  const label = `${key} (${timeString})`;

  return label;
};

export const createActivityChartDataset = (
  activity: ActivitySummaryByDate | ActivitySummaryByHostname,
) => {
  const activityEntriesSortedDesc = Object.entries(activity).sort(
    ([, value1], [, value2]) => {
      return value2 - value1;
    },
  );

  const itemsToDisplay: Array<[string, number]> = [];

  let totalActivityTime = 0;
  let restActivityTime = 0;

  for (const entry of activityEntriesSortedDesc) {
    const [, time] = entry;
    totalActivityTime += time;

    if (itemsToDisplay.length < MAX_ITEMS_TO_DISPLAY) {
      itemsToDisplay.push(entry);
      continue;
    }

    restActivityTime += time;
  }

  itemsToDisplay.push(['Other pages', restActivityTime]);

  const labels = itemsToDisplay.map(([key, value]) =>
    presentChartLabel(key, value),
  );

  const data = itemsToDisplay.map(([_, value]) =>
    Math.floor((value / totalActivityTime) * 100),
  );

  return {
    labels,
    data,
  };
};
