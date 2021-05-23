import { BrowserSyncStorage } from '../../shared/browser-sync-storage';
import { getIsoDate } from '../../shared/dates-helper';

export type DaylyWebsiteActivity = Record<string, number>;

// TODO: Take in account background time
// Split metrics to total active and total background time
// Add simultaneous usage on several devices into account

export const TOTAL_DAILY_BROWSER_ACTIVITY = 'total-time-spent';

export const addActivityTimeToHost = (
  storage: BrowserSyncStorage,
  host: string,
  duration: number
) => {
  const currentDate = getIsoDate(new Date());

  const store = storage.getCachedStorage();

  // Update host time
  const currentDateRecord = store[currentDate] || {};

  currentDateRecord[host] = (currentDateRecord[host] || 0) + duration;

  store[currentDate] = currentDateRecord;

  // Update total browser activity time
  const totalBrowserActivity = store[TOTAL_DAILY_BROWSER_ACTIVITY] || {};

  totalBrowserActivity[currentDate] =
    (totalBrowserActivity[currentDate] || 0) + duration;

  store[TOTAL_DAILY_BROWSER_ACTIVITY] = totalBrowserActivity;

  return storage.set(store);
};
