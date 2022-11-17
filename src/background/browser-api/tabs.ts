import { browser } from 'webextension-polyfill-ts';

import { ActiveTabState } from '../../shared/db/types';

export type TabActiveInfo = chrome.tabs.TabActiveInfo;
export type Tab = chrome.tabs.Tab;
export type IdleState = chrome.idle.IdleState;

export const getActiveAudibleTab = () =>
  chrome.tabs.query({
    active: true,
    audible: true,
  });

export const getTabInfo = (tabId: number) => browser.tabs.get(tabId);

export const getAllActiveTabs = () =>
  chrome.tabs.query({
    active: true,
  });

export const getActiveTabFromFocusedWindow = async (
  windowId: number,
  tabId: number
): Promise<Partial<ActiveTabState>> => {
  const activeTabWindow = await browser.windows.get(windowId);
  if (!activeTabWindow.focused) {
    return {};
  }

  const tabs = await chrome.tabs.query({
    windowId,
  });

  const focusedActiveTab = tabs.find((tab) => tabId === tab.id) || null;

  return {
    focusedWindowId: windowId,
    focusedActiveTab,
  };
};

export const getActiveTabFromWindowId = async (windowId: number) => {
  const [activeTab = null] =
    windowId === browser.windows.WINDOW_ID_NONE
      ? await getActiveAudibleTab()
      : await chrome.tabs.query({
          windowId,
          active: true,
        });

  return activeTab;
};

const greyOutCss = `
body {
  transition: all 0.5s ease;
  filter: grayscale(100%) !important;
  background: black !important;
  opacity: 0.6 !important;
}`;

export const greyOutTab = async (tabId: number) => {
  await browser.tabs.insertCSS?.(tabId, { code: greyOutCss });
  await browser.scripting.insertCSS?.({
    target: {
      tabId,
    },
    css: greyOutCss,
  });
  //   await browser.tabs.executeScript(tabId, {
  //     code,
  //   });
};

export const unGreyOutTab = async (tabId: number) => {
  await browser.tabs.removeCSS?.(tabId, { code: greyOutCss });
  await browser.scripting.removeCSS?.({
    target: {
      tabId,
    },
    css: greyOutCss,
  });
  //   await browser.tabs.executeScript(tabId, {
  //     code,
  //   });
};
