import { ActivitySummaryByHostname, TimeStore } from '@shared/db/types';
import { HostName, IsoDate } from '@shared/types';
import { generatePrior7DaysDates, getIsoDate } from '@shared/utils/date';

export { ActivitySummaryByHostname };
export type ActivitySummaryByDate = Record<IsoDate, number>;

export const getTotalDailyActivity = (
  store: TimeStore,
): ActivitySummaryByDate => {
  const result: ActivitySummaryByDate = {};

  for (const [date, activity] of Object.entries(store)) {
    result[date as IsoDate] = Object.values(activity).reduce(
      (acc, val) => acc + val,
      0,
    );
  }

  return result;
};

export const calculateTotalActivity = (
  activity: ActivitySummaryByDate | ActivitySummaryByHostname,
): number => {
  return Object.values(activity).reduce((sum, val) => sum + val, 0);
};

export const transformDailyActivityValues = (
  activityByDate: ActivitySummaryByDate,
  mapFn: (date: IsoDate, time: number) => number,
): ActivitySummaryByDate => {
  const result: ActivitySummaryByDate = {};

  for (const [date, time] of Object.entries(activityByDate)) {
    result[date as IsoDate] = mapFn(date as IsoDate, time);
  }

  return result;
};

export const getTotalWebsiteActivity = (
  store: TimeStore,
): ActivitySummaryByHostname => {
  const result: ActivitySummaryByHostname = {};

  for (const activity of Object.values(store)) {
    for (const [domain, time] of Object.entries(activity)) {
      const hostname = domain as HostName;

      result[hostname] ??= 0;
      result[hostname] += time;
    }
  }

  return result;
};

export const getFilteredWebsiteTimeStoreSlice = (
  store: TimeStore,
  filterFn: (date: IsoDate, hostname: HostName, time: number) => boolean,
) => {
  const result: TimeStore = {};

  for (const [date, activity] of Object.entries(store)) {
    const isoDate = date as IsoDate;
    result[isoDate] = Object.fromEntries(
      Object.entries(activity).filter(([domain, time]) =>
        filterFn(isoDate, domain as HostName, time),
      ),
    );
  }

  return result;
};

export const getTimeStoreWebsiteSlice = (
  store: TimeStore,
  hostnames: [HostName, ...HostName[]],
): TimeStore => {
  const result: TimeStore = {};

  for (const [date, activity] of Object.entries(store)) {
    result[date as IsoDate] = Object.fromEntries(
      Object.entries(activity).filter(([domain]) =>
        hostnames.includes(domain as HostName),
      ),
    );
  }

  return result;
};

export const getTimeStoreWeekSlice = (
  store: TimeStore,
  endDate: Date,
): TimeStore => {
  const result: TimeStore = {};

  for (const date of generatePrior7DaysDates(endDate)) {
    const isoDate = getIsoDate(date);
    result[isoDate] = store[isoDate] ?? {};
  }

  return result;
};

export const transformTimeStoreValues = (
  store: TimeStore,
  mapFn: (date: IsoDate, key: HostName, time: number) => number,
): TimeStore => {
  const result: TimeStore = {};

  for (const [date, activity] of Object.entries(store)) {
    const isoDate = date as IsoDate;
    for (const [domain, time] of Object.entries(activity)) {
      const hostname = domain as HostName;

      result[isoDate] ??= {};
      result[isoDate][hostname] = mapFn(isoDate, hostname, time);
    }
  }

  return result;
};
