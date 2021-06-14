import { browser } from 'webextension-polyfill-ts';

import { combineActivityControllers } from './background/controller/combined.controller';
import { DetailedActivityController } from './background/controller/detailed-activity.controller';
import { OverallActivityController } from './background/controller/overall-activity.controller';
import { WindowActiveTabStateMonitor } from './background/tracking/active-tabs.monitor';
import { ActiveTabTracker } from './background/tracking/activity.tracker';
import { createGlobalSyncStorageListener } from './shared/browser-sync-storage';

const PULL_SYNC_STORAGE_ALARM_NAME = 'pull-sync-storage';
const SYNC_STORAGE_INTERVAL_MINUTES = 30;

try {
  const storage = createGlobalSyncStorageListener();
  const activityController = combineActivityControllers(
    new OverallActivityController(storage),
    new DetailedActivityController()
  );
  const activeTabTracker = new ActiveTabTracker(activityController);
  const activeTabMonitor = new WindowActiveTabStateMonitor();

  activeTabMonitor.init().then(() => {
    activeTabMonitor.onStateChange((newState) =>
      activeTabTracker.handleTabsStateChange(newState)
    );
  });

  browser.alarms.create(PULL_SYNC_STORAGE_ALARM_NAME, {
    periodInMinutes: SYNC_STORAGE_INTERVAL_MINUTES,
  });

  browser.alarms.onAlarm.addListener(
    (alarm) =>
      alarm.name === PULL_SYNC_STORAGE_ALARM_NAME && storage.pullSyncStorage()
  );
} catch (error) {
  console.error(error);
}
