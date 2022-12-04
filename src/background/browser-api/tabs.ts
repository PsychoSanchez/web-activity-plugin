import { ActiveTabState } from '../../shared/db/types';
import { LIMIT_EXCEEDED, LIMIT_OK } from '../../shared/messages';
import { ignore, throwIfNot } from '../../shared/utils/errors';

import {
  isCouldNotEstablishConnectionError,
  isTabNotExistError,
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
    const error = chrome.runtime.lastError;
    if (error?.message?.includes(`${tabId}`)) {
      // Will throw if the error message contains the tabId and it's not a isTabNotExistError
      throwIfNot(isTabNotExistError)(error);
    }
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

  return (
    tabs.filter((tab) => tab.active)[0] ??
    tabs.filter((tab) => tab.highlighted)[0]
  );
};

export const getTabFromFocusedWindow = async (
  windowId: number,
  tabId: number
): Promise<Partial<ActiveTabState>> => {
  const activeTabWindow = await chrome.windows.get(windowId);
  if (!activeTabWindow.focused) {
    return {};
  }

  const tabs = await chrome.tabs.query({
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
    windowId === chrome.windows.WINDOW_ID_NONE
      ? await getActiveAudibleTab()
      : await chrome.tabs.query({
          windowId,
          active: true,
        });

  return activeTab;
};

export const greyOutTab = async (tabId: number) => {
  await chrome.tabs
    .sendMessage(tabId, {
      type: LIMIT_EXCEEDED,
    })
    .catch(ignore(isTabNotExistError, isCouldNotEstablishConnectionError));
};

export const unGreyOutTab = async (tabId: number) => {
  await chrome.tabs
    .sendMessage(tabId, {
      type: LIMIT_OK,
    })
    .catch(ignore(isTabNotExistError, isCouldNotEstablishConnectionError));
};
