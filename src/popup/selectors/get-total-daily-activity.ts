import { getIsoDate } from '@shared/utils/dates-helper';

import { TimeStore } from '../hooks/useTimeStore';

export const getTotalDailyActivity = (store: TimeStore, date: Date) => {
  const todayIsoDate = getIsoDate(date);
  const todaysWebsitesUsage: Record<string, number> = store[todayIsoDate] || {};

  return Object.values(todaysWebsitesUsage).reduce(
    (sum, websiteTime) => sum + websiteTime,
    0,
  );
};
