import { ActiveTabState } from '@shared/db/types';
import { LIMIT_EXCEEDED, LIMIT_OK } from '@shared/messages';
import { ignore } from '@shared/utils/errors';

import {
  isCouldNotEstablishConnectionError,
  isTabNotExistError,
  throwRuntimeLastError,
} from './errors';
import { getFocusedWindowId } from './windows';

export const getActiveAudibleTab = () =>
  chrome.tabs.query({
    active: true,
    audible: true,
  });

export const getTabInfo = async (tabId: number) => {
  try {
    const tab = await chrome.tabs.get(tabId);
    throwRuntimeLastError();
    return tab;
  } catch (error) {
    return ignore(isTabNotExistError)(error);
  }
};

export const getAllActiveTabs = () =>
  chrome.tabs.query({
    active: true,
  });

export const getFocusedTab = async () => {
  const windowId = await getFocusedWindowId();
  const tabs = await chrome.tabs.query({
    windowId,
  });
  throwRuntimeLastError();

  return (
    tabs.filter((tab) => tab.active)[0] ??
    tabs.filter((tab) => tab.highlighted)[0]
  );
};

export const getTabFromFocusedWindow = async (
  windowId: number,
  tabId: number,
): Promise<Partial<ActiveTabState>> => {
  const activeTabWindow = await chrome.windows.get(windowId);
  if (!activeTabWindow.focused) {
    return {};
  }

  const tabs = await chrome.tabs.query({
    windowId,
  });
  throwRuntimeLastError();

  const focusedActiveTab = tabs.find((tab) => tabId === tab.id) ?? null;

  return {
    focusedWindowId: windowId,
    focusedActiveTab,
  };
};

export const getActiveTabFromWindowId = async (windowId: number) => {
  const [activeTab = null] =
    windowId === chrome.windows.WINDOW_ID_NONE
      ? await getActiveAudibleTab()
      : await chrome.tabs.query({
          windowId,
          active: true,
        });

  throwRuntimeLastError();

  return activeTab;
};

export const greyOutTab = async (tabId: number) => {
  try {
    await chrome.tabs.sendMessage(tabId, {
      type: LIMIT_EXCEEDED,
    });
    throwRuntimeLastError();
  } catch (error) {
    ignore(isTabNotExistError, isCouldNotEstablishConnectionError)(error);
  }
};

export const unGreyOutTab = async (tabId: number) => {
  try {
    await chrome.tabs.sendMessage(tabId, {
      type: LIMIT_OK,
    });
    throwRuntimeLastError();
  } catch (error) {
    ignore(isTabNotExistError, isCouldNotEstablishConnectionError)(error);
  }
};
