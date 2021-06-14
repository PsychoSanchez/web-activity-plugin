import { BrowserSyncStorage } from '../../shared/browser-sync-storage';
import { getIsoDate } from '../../shared/dates-helper';

export type DailyWebsiteActivity = Record<string, number>;

// TODO: Take in account background time
// Split metrics to total active and total background time
// Add simultaneous usage on several devices into account

export const addActivityTimeToHost = (
  storage: BrowserSyncStorage,
  host: string,
  duration: number
) => {
  const currentDate = getIsoDate(new Date());

  const store = storage.getCachedStorage();

  // Update host time
  const currentDateRecord = store[currentDate] || {};

  if (typeof currentDateRecord !== 'object') {
    return;
  }

  currentDateRecord[host] = (currentDateRecord[host] || 0) + duration;

  store[currentDate] = currentDateRecord;

  return storage.set(store);
};
