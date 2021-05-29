import { AppStore } from '../hooks/useTimeStore';
import { getIsoDate } from '../shared/dates-helper';

export const getTotalDailyActivity = (store: AppStore, date: Date) => {
  const todayIsoDate = getIsoDate(date);
  const todaysWebsitesUsage: Record<string, number> = store[todayIsoDate] || {};

  return Object.values(todaysWebsitesUsage).reduce(
    (sum, websiteTime) => sum + websiteTime,
    0
  );
};
