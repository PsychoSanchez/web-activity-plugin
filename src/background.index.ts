import { browser } from 'webextension-polyfill-ts';

import { addActivityTimeToHost } from './background/storage/accumulated-daily-activity';
import { HistoryActivityStorage } from './background/storage/history-activity';
import {
  ActiveTabTrackerListener,
  ActiveTabTracker,
} from './background/tracking/active-tab-tracker';
import {
  addGetActivityStoreMessageListener,
  sendMessageWithStoreUpdate,
} from './shared/background-browser-sync-storage';
import { createGlobalSyncStorageListener } from './shared/browser-sync-storage';

const isAudioConference = async () => {
  try {
    const tabs = await browser.tabs.query({
      active: true,
      microphone: true,
    });

    return tabs.length > 0;
  } catch (error) {
    // Does not work in chrome
  }
  return false;
};

const isLastActiveTabAudible = async () => {
  const tabs = await browser.tabs.query({
    active: true,
    audible: true,
  });

  return tabs.length > 0;
};

try {
  const browserSyncStorage = createGlobalSyncStorageListener();
  const activeTabTracker = new ActiveTabTracker();
  const history = new HistoryActivityStorage();

  addGetActivityStoreMessageListener(browserSyncStorage);
  browserSyncStorage.subscribe(sendMessageWithStoreUpdate);

  const handleActiveTabChange: ActiveTabTrackerListener = async (newTab) => {
    const url = newTab?.url;
    const prevActivePage = history.getLastActivePage();
    const ts = Date.now();

    if (url) {
      const newTabUrl = new URL(url);
      history.setLastActivePage(newTabUrl.hostname, ts);
    } else {
      // Page is in background
      // Check if last active page playing video or in audio conference
      const isActive =
        (await isLastActiveTabAudible()) || (await isAudioConference());

      if (!isActive) {
        history.resetLastActivePage();
      }
    }

    if (prevActivePage) {
      addActivityTimeToHost(
        browserSyncStorage,
        prevActivePage.hostname,
        ts - prevActivePage.date
      );
    }
  };

  activeTabTracker.addListener(handleActiveTabChange);
  // @ts-ignore
  global.browserSyncStorage = browserSyncStorage;
} catch (error) {
  console.error(error);
}
