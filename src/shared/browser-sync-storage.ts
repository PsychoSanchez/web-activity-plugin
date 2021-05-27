import { browser } from 'webextension-polyfill-ts';

type Store = Record<string, Record<string, number> | number>;

const PUSH_SYNC_STORAGE_ALARM_NAME = 'push-sync-storage';
const SYNC_STORAGE_INTERVAL_MINUTES = 15;

// Sync storage needs to throttle, max amount of updates per day is 8000
browser.alarms.create(PUSH_SYNC_STORAGE_ALARM_NAME, {
  periodInMinutes: SYNC_STORAGE_INTERVAL_MINUTES,
});

browser.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === PUSH_SYNC_STORAGE_ALARM_NAME) {
    const localStorage = await browser.storage.local.get();
    browser.storage.sync.set(localStorage);
  }
});

const mergeStore = (storeA: Store, storeB: Store): Store => {
  const storeAKeys = Object.keys(storeA);
  const storeBKeys = Object.keys(storeB);

  const keys = Array.from(new Set([...storeAKeys, ...storeBKeys]));

  return keys.reduce((res, key) => {
    const valA = storeA[key] || 0;
    const valB = storeB[key] || 0;

    if (typeof valA === 'object' && typeof valB === 'object') {
      res[key] = mergeStore(valA, valB) as any;
      return res;
    }

    if (typeof valA === 'number' && typeof valB === 'number') {
      res[key] = Math.max(valA, valB);
      return res;
    }

    res[key] = storeA[key] || storeB[key];

    return res;
  }, {} as Store);
};

export const createGlobalSyncStorageListener = (): BrowserSyncStorage => {
  let cachedStore = {};

  Promise.all([
    browser.storage.local.get().then((localStore) => {
      cachedStore = mergeStore(cachedStore, localStore);
    }),
    browser.storage.sync.get().then((syncStore) => {
      cachedStore = mergeStore(cachedStore, syncStore);
    }),
  ]).then(() => {
    browser.storage.local.set(cachedStore);
    browser.storage.sync.set(cachedStore);
  });

  browser.storage.onChanged.addListener(async (changes) => {
    const localStore = await browser.storage.local.get();
    cachedStore = {
      ...cachedStore,
      ...localStore,
      ...changes.newValue,
    };
  });

  return {
    getCachedStorage() {
      return { ...cachedStore };
    },
    set(store: Store) {
      return browser.storage.local.set(store);
    },
    async pullSyncStorage() {
      const syncStorage = await browser.storage.sync.get();
      const localStorage = await browser.storage.local.get();
      cachedStore = mergeStore(
        mergeStore(cachedStore, syncStorage),
        localStorage
      );
    },
  };
};

export interface BrowserSyncStorage {
  getCachedStorage(): Store;
  set(store: Store): Promise<void>;
  pullSyncStorage(): Promise<void>;
}
