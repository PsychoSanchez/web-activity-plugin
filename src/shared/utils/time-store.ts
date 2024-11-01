import { TimeStore } from '@shared/db/types';
import { get7DaysPriorDate, getIsoDate } from '@shared/utils/dates-helper';

export const mergeTimeStore = (
  storeA: TimeStore,
  storeB: TimeStore,
): TimeStore => {
  const allStoreKeys = Object.keys({ ...(storeA || {}), ...(storeB || {}) });
  const mergedStore: TimeStore = {};

  for (const key of allStoreKeys) {
    const storeAValue = storeA[key];
    const storeBValue = storeB[key];
    const storeValueKeys = Object.keys({ ...storeAValue, ...storeBValue });

    const mergedValue: Record<string, number> = {};
    for (const storeValueKey of storeValueKeys) {
      const timeA = storeAValue?.[storeValueKey] || 0;
      const timeB = storeBValue?.[storeValueKey] || 0;
      mergedValue[storeValueKey] = Math.max(timeA, timeB);
    }

    mergedStore[key] = mergedValue;
  }

  return mergedStore;
};

export const getTotalDailyActivity = (store: TimeStore, date: Date) => {
  const todayIsoDate = getIsoDate(date);
  const todaysWebsitesUsage: Record<string, number> = store[todayIsoDate] || {};

  return Object.values(todaysWebsitesUsage).reduce(
    (sum, websiteTime) => sum + websiteTime,
    0,
  );
};

export const getTotalWeeklyActivity = (store: TimeStore, date = new Date()) =>
  get7DaysPriorDate(date).reduce(
    (sum, date) => sum + getTotalDailyActivity(store, date),
    0,
  );
