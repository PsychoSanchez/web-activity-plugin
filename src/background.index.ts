import { WindowActiveTabStateMonitor } from './background/tracking/active-tabs.monitor';
import { ActiveTabTracker } from './background/tracking/active-tab.tracker';
import { createGlobalSyncStorageListener } from './shared/browser-sync-storage';
import { browser } from 'webextension-polyfill-ts';

const PULL_SYNC_STORAGE_ALARM_NAME = 'pull-sync-storage';
const SYNC_STORAGE_INTERVAL_MINUTES = 30;

try {
  const storage = createGlobalSyncStorageListener();
  const activeTabTracker = new ActiveTabTracker(storage);
  const activeTabMonitor = new WindowActiveTabStateMonitor();

  browser.alarms.create(PULL_SYNC_STORAGE_ALARM_NAME, {
    periodInMinutes: SYNC_STORAGE_INTERVAL_MINUTES,
  });

  activeTabMonitor.init().then(() => {
    activeTabMonitor.onStateChange((newState) =>
      activeTabTracker.trackNewActiveTabState(newState)
    );
  });

  browser.alarms.onAlarm.addListener(
    (alarm) =>
      alarm.name === PULL_SYNC_STORAGE_ALARM_NAME && storage.pullSyncStorage()
  );
} catch (error) {
  console.error(error);
}
