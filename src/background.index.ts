import { ActivityStateController } from './background/controller/activity-controller';
import {
  handleActiveTabStateChange,
  handleAlarm,
  handleIdleStateChange,
  handleTabUpdate,
  handleWindowFocusChange,
} from './background/services/state-service';
import { logMessage } from './background/tables/logs';
import { handleStorageChange, syncStorage } from './shared/db/sync-storage';

const ASYNC_POLL_ALARM_NAME = 'async-poll';
const ASYNC_POLL_INTERVAL_MINUTES = 1;

chrome.alarms.create(ASYNC_POLL_ALARM_NAME, {
  periodInMinutes: ASYNC_POLL_INTERVAL_MINUTES,
  when: Date.now() + 1000,
});

const PUSH_SYNC_STORAGE_ALARM_NAME = 'push-sync-storage';
const SYNC_STORAGE_INTERVAL_MINUTES = 15;

chrome.alarms.create(PUSH_SYNC_STORAGE_ALARM_NAME, {
  periodInMinutes: SYNC_STORAGE_INTERVAL_MINUTES,
  when: Date.now() + 1000,
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === ASYNC_POLL_ALARM_NAME) {
    logMessage('alarm fired');
    const ts = Date.now();
    const newState = await handleAlarm();

    await ctrl().handleStateChange(newState, ts);
  } else if (alarm.name === PUSH_SYNC_STORAGE_ALARM_NAME) {
    await syncStorage();
  }
});

chrome.storage.onChanged.addListener(async (changes) => {
  handleStorageChange(changes);
});

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const ts = Date.now();
  logMessage('tab activated: ' + activeInfo.tabId);

  const newState = await handleActiveTabStateChange(activeInfo);
  if (newState) {
    await ctrl().handleStateChange(newState, ts);
  }
});

chrome.tabs.onUpdated.addListener(async (_tabId, _changeInfo, tab) => {
  const ts = Date.now();
  logMessage('tab updated: ' + tab.id);

  const newState = await handleTabUpdate(tab);
  if (newState) {
    await ctrl().handleStateChange(newState, ts);
  }
});

// onFocusChanged does not work in Windows 7/8/10 when user alt-tabs or clicks away
chrome.windows.onFocusChanged.addListener(async (windowId) => {
  const ts = Date.now();
  logMessage('window focus changed: ' + windowId);

  const newState = await handleWindowFocusChange(windowId);
  if (newState) {
    await ctrl().handleStateChange(newState, ts);
  }
});

chrome.idle.onStateChanged.addListener(async (newIdleState) => {
  logMessage('idle state changed: ' + newIdleState);
  const ts = Date.now();

  const newTabState = await handleIdleStateChange(newIdleState);
  await ctrl().handleStateChange(newTabState, ts);
});

function ctrl() {
  return new ActivityStateController();
}
