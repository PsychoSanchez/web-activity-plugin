import { throttle } from 'throttle-debounce';
import { browser } from 'webextension-polyfill-ts';
import { getMinutesInMs } from './dates-helper';

type Store = Record<string, any>;
type StorageSubscriber = (store: Store) => void;

const THROTTLE_TIMEOUT = getMinutesInMs(5);

// Sync storage needs to throttle, max amount of updates per day is 8000
const throttledStorageSyncSet = throttle(THROTTLE_TIMEOUT, (store: Store) =>
  browser.storage.sync.set(store)
);

export const createGlobalSyncStorageListener = (): BrowserSyncStorage => {
  const subscribers: StorageSubscriber[] = [];
  let cachedStore = {};

  browser.storage.sync.get().then((store) => {
    cachedStore = store;
  });

  browser.storage.onChanged.addListener((changes) => {
    cachedStore = {
      ...cachedStore,
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
