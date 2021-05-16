import { browser } from 'webextension-polyfill-ts';
import { getIsoDate } from '../../shared/dates-helper';

export type DaylyWebsiteActivity = Record<string, number>;

// TODO: Take in account background time
// Splt metrics to total active and total bckground time
// Add simultanious usage on several devices into account

export const TOTAL_DAILY_BROWSER_ACTIVITY = 'total-time-spent';

export const addActivityTimeToHost = async (host: string, duration: number) => {
  const currentDate = getIsoDate(new Date());

  const store = await browser.storage.sync.get();

  // Update host time
  const currentDateRecord = store[currentDate] || {};

  currentDateRecord[host] = (currentDateRecord[host] || 0) + duration;

  store[currentDate] = currentDateRecord;

  // Update total browser activity time
  const totalBrowserActivity = store[TOTAL_DAILY_BROWSER_ACTIVITY] || {};

  totalBrowserActivity[currentDate] =
    (totalBrowserActivity[currentDate] || 0) + duration;

  store[TOTAL_DAILY_BROWSER_ACTIVITY] = totalBrowserActivity;

  await browser.storage.sync.set(store);
};

export const getAllBrowserActivity = async () => {
  return (await browser.storage.sync.get()) || {};
};
