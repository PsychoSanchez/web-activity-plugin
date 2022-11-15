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

const getLocalStore = async (): Promise<TimeStore> => {
  const [localStore, dbStore] = await Promise.all([
    browser.storage.local.get(),
    getDbCache(),
  ]);
  return mergeTimeStore(dbStore, localStore);
};

export const addActivityTimeToHost = async (host: string, duration: number) => {
  const currentDate = getIsoDate(new Date());

  const store = await getLocalStore();

  // Update host time
  store[currentDate] ??= {};
  const currentDateRecord = store[currentDate];

  if (typeof currentDateRecord !== 'object') {
    return;
  }

  currentDateRecord[host] ??= 0;
  currentDateRecord[host] += duration;

  return setLocalStore(store);
};

export const handleStorageChange = async (changes: any) => {
  const cache = await getLocalStore();
  await setDbCache({ ...cache, ...changes.newValue });
};

export const syncStorage = async () => {
  const cache = await getLocalStore();
  await browser.storage.sync.set(cache);
};
