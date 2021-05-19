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

export const createGlobalSyncStorageListener = (): BrowserSyncStorage => {
  const subscribers: StorageSubscriber[] = [];
  let cachedStore = {};

  Promise.race([browser.storage.local.get(), browser.storage.sync.get()]).then(
    (store = {}) => {
      cachedStore = store;
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
