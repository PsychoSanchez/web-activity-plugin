import { browser } from 'webextension-polyfill-ts';
import { BrowserSyncStorage } from './browser-sync-storage';

export const GET_ACTIVITY_STORE = 'get-activity-store';
export const ACTIVITY_STORE_UPDATE_MESSAGE = 'activity-store-update';

export const subscribeToBackgroundBrowserSyncStoreUpdate = (
  listener: (store: Record<string, any>) => void
) => {
  browser.runtime
    .sendMessage({ type: GET_ACTIVITY_STORE })
    .then((payload) => listener(payload));

  browser.runtime.onMessage.addListener((message) => {
    if (message.type === ACTIVITY_STORE_UPDATE_MESSAGE) {
      listener(message.payload);
    }
  });
};

export const unsubscribeFromBackgroundBrowserSyncStoreUpdate = (
  listener: (store: Record<string, any>) => void
) => {
  browser.runtime.onMessage.removeListener(listener);
};

export const sendMessageWithStoreUpdate = (newStore: any) => {
  browser.runtime
    .sendMessage({
      type: ACTIVITY_STORE_UPDATE_MESSAGE,
      payload: newStore,
    })
    .catch((error) => {
      if (error.message.startsWith('Could not establish connection')) {
        return;
      }

      console.error(error);
    });
};

export const addGetActivityStoreMessageListener = (
  browserSyncStorage: BrowserSyncStorage
) => {
  browser.runtime.onMessage.addListener((message, _sender, ...params) => {
    //@ts-ignore
    const sendResponse: (message: any) => void = params[0];

    console.log(sendResponse);

    if (message.type === GET_ACTIVITY_STORE) {
      sendResponse(browserSyncStorage.getCachedStorage());
    }
  });
};
