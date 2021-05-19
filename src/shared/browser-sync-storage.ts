import { throttle } from 'throttle-debounce';
import { browser } from 'webextension-polyfill-ts';

type Store = Record<string, any>;
type StorageSubcriber = (store: Store) => void;

const THROTTLE_TIMEOUT = 15000;

// Sync storage needs to throttle, max amount of updates per day is 8000
const throttledStorageSyncSet = throttle(THROTTLE_TIMEOUT, (store: Store) =>
  browser.storage.sync.set(store)
);

export const createGlobalSyncStorageListener = (): BrowserSyncStorage => {
  const subscsribers: StorageSubcriber[] = [];
  let cachedStore = {};

  browser.storage.sync.get().then((store) => {
    cachedStore = store;
  });

  browser.storage.onChanged.addListener((changes) => {
    cachedStore = {
      ...cachedStore,
      ...changes.newValue,
    };

    subscsribers.forEach((sub) => sub(cachedStore));
  });

  return {
    getCachedStorage() {
      return { ...cachedStore };
    },
    onChanged(listener: StorageSubcriber) {
      listener(cachedStore);
      subscsribers.push(listener);
    },
    unsubscribe(listener: StorageSubcriber) {
      const index = subscsribers.findIndex((sub) => sub === listener);

      if (index > -1) {
        subscsribers.splice(index, 1);
      }
    },
    set(store: Store) {
      return throttledStorageSyncSet(store);
    },
  };
};

export interface BrowserSyncStorage {
  getCachedStorage(): Store;
  onChanged(listener: StorageSubcriber): void;
  unsubscribe(listener: StorageSubcriber): void;
  set(store: Store): Promise<void>;
}
