import { browser } from 'webextension-polyfill-ts';

import { getTabInfo, unGreyOutTab } from './background/browser-api/tabs';
import { handleStateChange } from './background/controller';
import {
  handleActiveTabStateChange,
  handleAlarm,
  handleIdleStateChange,
  handleTabUpdate,
  handleWindowFocusChange,
} from './background/services/state-service';
import { logMessage } from './background/tables/logs';
import { syncStorage } from './shared/db/sync-storage';

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

    await handleStateChange(newState, ts);
  } else if (alarm.name === PUSH_SYNC_STORAGE_ALARM_NAME) {
    await syncStorage();
  }
});

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const ts = Date.now();
  logMessage('tab activated: ' + activeInfo.tabId);

  const tab = await getTabInfo(activeInfo.tabId);
  if (tab?.url?.startsWith('http')) {
    await unGreyOutTab(activeInfo.tabId);
    // await greyOutTab(activeInfo.tabId);
  }

  const newState = await handleActiveTabStateChange(activeInfo);
  if (newState) {
    await handleStateChange(newState, ts);
  }
});

browser.tabs.onUpdated.addListener(async (_tabId, _changeInfo, tab) => {
  const ts = Date.now();
  logMessage('tab updated: ' + tab.id);

  const newState = await handleTabUpdate(tab);
  if (newState) {
    await handleStateChange(newState, ts);
  }
});

// onFocusChanged does not work in Windows 7/8/10 when user alt-tabs or clicks away
chrome.windows.onFocusChanged.addListener(async (windowId) => {
  const ts = Date.now();
  logMessage('window focus changed: ' + windowId);

  const newState = await handleWindowFocusChange(windowId);
  if (newState) {
    await handleStateChange(newState, ts);
  }
});

chrome.idle.onStateChanged.addListener(async (newIdleState) => {
  logMessage('idle state changed: ' + newIdleState);
  const ts = Date.now();

  const newTabState = await handleIdleStateChange(newIdleState);

  await handleStateChange(newTabState, ts);
});

chrome.webNavigation.onCompleted.addListener(async (details) => {
  logMessage('web navigation: ' + details.tabId);
  const ts = Date.now();

  const tab = await getTabInfo(details.tabId);
  if (!tab) {
    return;
  }

  const newState = await handleTabUpdate(tab);
  if (!newState) {
    return;
  }

  await handleStateChange(newState, ts);
});

chrome.runtime.onMessage.addListener(
  async (_message, _sender, sendResponse) => {
    sendResponse({ alive: true });

    const ts = Date.now();
    const newState = await handleAlarm();
    handleStateChange(newState, ts);
  }
);
