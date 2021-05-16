import { browser } from 'webextension-polyfill-ts';

type Store = Record<string, any>;
type StorageSubcriber = (store: Store) => void;

export const createGlobalSyncStorageListener = (): BrowserSyncStorage => {
  const subscsribers: StorageSubcriber[] = [];
  let cachedStorage = {};
  browser.storage.sync.get().then((store) => {
    cachedStorage = store;
  });

  browser.storage.onChanged.addListener((changes) => {
    cachedStorage = {
      ...cachedStorage,
      ...changes,
    };

    subscsribers.forEach((sub) => sub(cachedStorage));
  });

  return {
    getCachedStorage() {
      return cachedStorage;
    },
    subscsribe(listener: StorageSubcriber) {
      listener(cachedStorage);
      subscsribers.push(listener);
    },
    unsubscribe(listener: StorageSubcriber) {
      const index = subscsribers.findIndex((sub) => sub === listener);

      if (index > -1) {
        subscsribers.splice(index, 1);
      }
    },
  };
};

export interface BrowserSyncStorage {
  getCachedStorage(): Store;
  subscsribe(listener: StorageSubcriber): void;
  unsubscribe(listener: StorageSubcriber): void;
}
