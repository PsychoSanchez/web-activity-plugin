import { browser } from 'webextension-polyfill-ts';

import { ActiveTabState } from '../../shared/db/types';
import { ignore } from '../../shared/utils/errors';

import { isTabNotExistError } from './errors';
import { getFocusedWindowId } from './windows';

export const getActiveAudibleTab = () =>
  browser.tabs.query({
    active: true,
    audible: true,
  });

export const getTabInfo = (tabId: number) =>
  browser.tabs.get(tabId).catch(ignore(isTabNotExistError));

export const getAllActiveTabs = () =>
  browser.tabs.query({
    active: true,
  });

export const getFocusedTab = async () => {
  const windowId = await getFocusedWindowId();
  const tabs = await browser.tabs.query({
    windowId,
  });

  return (
    tabs.filter((tab) => tab.active)[0] ??
    tabs.filter((tab) => tab.highlighted)[0]
  );
};

export const getTabFromFocusedWindow = async (
  windowId: number,
  tabId: number
): Promise<Partial<ActiveTabState>> => {
  const activeTabWindow = await browser.windows.get(windowId);
  if (!activeTabWindow.focused) {
    return {};
  }

  const tabs = await browser.tabs.query({
    windowId,
  });

  const focusedActiveTab = tabs.find((tab) => tabId === tab.id) ?? null;

  return {
    focusedWindowId: windowId,
    focusedActiveTab,
  };
};

export const getActiveTabFromWindowId = async (windowId: number) => {
  const [activeTab = null] =
    windowId === browser.windows.WINDOW_ID_NONE
      ? await getActiveAudibleTab()
      : await browser.tabs.query({
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
  await Promise.all([
    browser.tabs.insertCSS?.(tabId, { code: greyOutCss }),
    browser.scripting.insertCSS?.({
      target: {
        tabId,
      },
      css: greyOutCss,
    }),
  ]).catch(ignore(isTabNotExistError));
};

export const unGreyOutTab = async (tabId: number) => {
  await Promise.all([
    browser.tabs.removeCSS?.(tabId, { code: greyOutCss }),
    browser.scripting.removeCSS?.({
      target: {
        tabId,
      },
      css: greyOutCss,
    }),
  ]).catch(ignore(isTabNotExistError));
};
