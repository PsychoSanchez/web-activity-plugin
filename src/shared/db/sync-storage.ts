import { browser } from 'webextension-polyfill-ts';

import { getIsoDate } from '../utils/dates-helper';
import { mergeTimeStore } from '../utils/merge-time-store';

import {
  connect,
  TimeTrackerStoreStateTableKeys,
  TimeTrackerStoreTables,
} from './idb';
import { TimeStore } from './types';

const getDbCache = async (): Promise<TimeStore> => {
  const db = await connect();
  const store = await db.get(
    TimeTrackerStoreTables.State,
    TimeTrackerStoreStateTableKeys.OverallState
  );

  return (store || {}) as TimeStore;
};
const setDbCache = async (store: TimeStore) => {
  const db = await connect();
  db.put(
    TimeTrackerStoreTables.State,
    store,
    TimeTrackerStoreStateTableKeys.OverallState
  );
};

const setLocalStore = async (store: TimeStore) => {
  await setDbCache(store);
  await browser.storage.local.set(store);
};

export const getLocalStore = async (): Promise<TimeStore> => {
  const [localStore, dbStore] = await Promise.all([
    browser.storage.local.get(),
    getDbCache(),
  ]);
  return mergeTimeStore(dbStore, localStore);
};

export const getCurrentHostTime = async (host: string): Promise<number> => {
  const store = await getLocalStore();
  const currentDate = getIsoDate(new Date());

  return (store[currentDate] as any)?.[host] ?? 0;
};

export const setTotalDailyHostTime = async ({
  date: day,
  host,
  duration,
}: {
  date: string;
  host: string;
  duration: number;
}) => {
  const store = await getLocalStore();

  store[day] ??= {};
  store[day][host] = duration;

  return setLocalStore(store);
};

export const syncStorage = async () => {
  const cache = await getLocalStore();
  await browser.storage.sync.set(cache);
};
