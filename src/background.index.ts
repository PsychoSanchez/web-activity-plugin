import { browser } from 'webextension-polyfill-ts';

import { combineActivityControllers } from './background/controller/combined.controller';
import { DetailedActivityVisitor } from './background/controller/detailed-activity.controller';
import { OverallActivityVisitor } from './background/controller/overall-activity.controller';
import { WindowActiveTabStateMonitor } from './background/tracking/active-tabs.monitor';
import { ActiveTabListener } from './background/tracking/activity.tracker';
import { createGlobalSyncStorageListener } from './shared/browser-sync-storage';

const PULL_SYNC_STORAGE_ALARM_NAME = 'pull-sync-storage';
const SYNC_STORAGE_INTERVAL_MINUTES = 30;

const storage = createGlobalSyncStorageListener();
const activityController = combineActivityControllers(
  new OverallActivityVisitor(storage),
  new DetailedActivityVisitor()
);
const activeTabListener = new ActiveTabListener(activityController);
const activeTabMonitor = new WindowActiveTabStateMonitor();

try {
  browser.alarms.create(PULL_SYNC_STORAGE_ALARM_NAME, {
    periodInMinutes: SYNC_STORAGE_INTERVAL_MINUTES,
  });

  browser.alarms.onAlarm.addListener(
    (alarm) =>
      alarm.name === PULL_SYNC_STORAGE_ALARM_NAME && storage.pullSyncStorage()
  );

  activeTabMonitor.init().then(() => {
    activeTabMonitor.onStateChange((newState, eventTimestamp) =>
      activeTabListener.handleStateChange(newState, eventTimestamp)
    );
  });
} catch (error) {
  console.error(error);
}
