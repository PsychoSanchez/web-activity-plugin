import { combineActivityControllers } from './background/controller/combined.controller';
import { DetailedActivityVisitor } from './background/controller/detailed-activity.controller';
import { OverallActivityVisitor } from './background/controller/overall-activity.controller';
import { logMessage } from './background/storage/timelines';
import {
  handleActiveTabStateChange,
  handleAlarm,
  handleIdleStateChange,
  handleTabUpdate,
  handleWindowFocusChange,
} from './background/tracking/active-tabs.monitor';
import { ActiveTabListener } from './background/tracking/activity.tracker';
import { createGlobalSyncStorageListener } from './shared/browser-sync-storage';

const ASYNC_POLL_ALARM_NAME = 'async-poll';
const ASYNC_POLL_INTERVAL_MINUTES = 1;

function controller() {
  const storage = createGlobalSyncStorageListener();
  const activityController = combineActivityControllers(
    new OverallActivityVisitor(storage),
    new DetailedActivityVisitor()
  );

  return new ActiveTabListener(activityController);
}

chrome.alarms.create(ASYNC_POLL_ALARM_NAME, {
  periodInMinutes: ASYNC_POLL_INTERVAL_MINUTES,
  when: Date.now() + 1000,
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === ASYNC_POLL_ALARM_NAME) {
    logMessage('alarm fired');
    const ts = Date.now();
    const newState = await handleAlarm();

    controller().handleStateChange(newState, ts);
  }
});

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const ts = Date.now();

  const newState = await handleActiveTabStateChange(activeInfo);
  if (newState) {
    controller().handleStateChange(newState, ts);
  }
});

chrome.tabs.onUpdated.addListener(async (_tabId, _changeInfo, tab) => {
  const ts = Date.now();

  const newState = await handleTabUpdate(tab);
  if (newState) {
    controller().handleStateChange(newState, ts);
  }
});

// onFocusChanged does not work in Windows 7/8/10 when user alt-tabs or clicks away
chrome.windows.onFocusChanged.addListener(async (windowId) => {
  const ts = Date.now();
  logMessage('window focus changed: ' + windowId);

  const newState = await handleWindowFocusChange(windowId);
  if (newState) {
    controller().handleStateChange(newState, ts);
  }
});

chrome.idle.onStateChanged.addListener(async (newIdleState) => {
  logMessage('idle state changed: ' + newIdleState);
  const ts = Date.now();

  const newTabState = await handleIdleStateChange(newIdleState);
  controller().handleStateChange(newTabState, ts);
});
