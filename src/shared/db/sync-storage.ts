import { browser } from 'webextension-polyfill-ts';

import { getIsoDate } from '../dates-helper';
import { mergeStore } from '../utils/merge-store';

import {
  connect,
  TimeTrackerStoreStateTableKeys,
  TimeTrackerStoreTables,
} from './idb';
import { Store } from './types';

const getDbCache = async (): Promise<Store> => {
  const db = await connect();
  const store = await db.get(
    TimeTrackerStoreTables.State,
    TimeTrackerStoreStateTableKeys.OverallState
  );

  return (store || {}) as Store;
};
const setDbCache = async (store: Store) => {
  const db = await connect();
  db.put(
    TimeTrackerStoreTables.State,
    store,
    TimeTrackerStoreStateTableKeys.OverallState
  );
};

const setLocalStore = async (store: Store) => {
  await setDbCache(store);
  await browser.storage.local.set(store);
};

const getLocalStore = async (): Promise<Store> => {
  const [localStore, dbStore] = await Promise.all([
    browser.storage.local.get(),
    getDbCache(),
  ]);
  return mergeStore(dbStore, localStore);
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
