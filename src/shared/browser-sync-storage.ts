import { throttle } from 'throttle-debounce';
import { browser } from 'webextension-polyfill-ts';
import { getMinutesInMs } from './dates-helper';

type Store = Record<string, any>;
type StorageSubscriber = (store: Store) => void;

const SYNC_STORAGE_THROTTLE_TIMEOUT = getMinutesInMs(1);

// Sync storage needs to throttle, max amount of updates per day is 8000
const throttledStorageSyncSet = throttle(
  SYNC_STORAGE_THROTTLE_TIMEOUT,
  (store: Store) => browser.storage.sync.set(store)
);

// const mergeStatistics = (storeA, storeB) => {
//   const storeAKeys = Object.keys(storeA);
//   const storeBKeys = Object.keys(storeB);

//   const keys = Array.from(new Set([...storeAKeys, ...storeBKeys]));

//   return keys.reduce((res, key) => {
//     const valA = storeA[key] || 0;
//     const valB = storeB[key] || 0;

//     if (typeof valA === 'number' && typeof valB === 'number') {
//       res[key] = Math.max(valA, valB);
//     } else {

//     }

//     return res;
//   }, {});
// };

export const createGlobalSyncStorageListener = (): BrowserSyncStorage => {
  const subscribers: StorageSubscriber[] = [];
  let cachedStore = {};

  Promise.all([browser.storage.local.get(), browser.storage.sync.get()]).then(
    ([localStore, syncedStore]) => {
      const updatedStore = {
        ...cachedStore,
        ...localStore,
        ...syncedStore,
      };

      browser.storage.local.set(updatedStore);
      browser.storage.sync.set(updatedStore);
    }
  );

  browser.storage.onChanged.addListener(async (changes) => {
    const localStore = await browser.storage.local.get();
    cachedStore = {
      ...cachedStore,
      ...localStore,
      ...changes.newValue,
    };

    subscribers.forEach((sub) => sub(cachedStore));
  });

  return {
    getCachedStorage() {
      return { ...cachedStore };
    },
    onChanged(listener: StorageSubscriber) {
      listener(cachedStore);
      subscribers.push(listener);
    },
    unsubscribe(listener: StorageSubscriber) {
      const index = subscribers.findIndex((sub) => sub === listener);

      if (index > -1) {
        subscribers.splice(index, 1);
      }
    },
    set(store: Store) {
      browser.storage.local.set(store);
      return throttledStorageSyncSet(store);
    },
  };
};

export interface BrowserSyncStorage {
  getCachedStorage(): Store;
  onChanged(listener: StorageSubscriber): void;
  unsubscribe(listener: StorageSubscriber): void;
  set(store: Store): Promise<void>;
}
