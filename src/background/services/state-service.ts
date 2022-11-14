import { browser } from 'webextension-polyfill-ts';

import { ActiveTabState } from '../../shared/db/types';
import {
  createTabsStateTransaction,
  getTabsState,
  setTabsState,
} from '../tables/state';

// remember last active tab
// if idle state changes to idle clear stopwatch and send time
// while state is idle (user did not interact for a minute) and last active tab audible keep sending heartbeats
// do not track time in locked state
// once idle state changes back to active, start track last active tab again

type TabActiveInfo = chrome.tabs.TabActiveInfo;
type Tab = chrome.tabs.Tab;
type IdleState = chrome.idle.IdleState;

const DEFAULT_ACTIVE_TAB_STATE: ActiveTabState = {
  activeTabs: [],
  focusedActiveTab: null,
  focusedWindowId: browser.windows.WINDOW_ID_NONE,
  idleState: 'active',
};

async function getTabsStateOrDefault() {
  return (await getTabsState()) ?? DEFAULT_ACTIVE_TAB_STATE;
}

function isUserDraggingWindowError(error: any) {
  return error.message.indexOf('user may be dragging a tab') > -1;
}

const getFocusedWindowId = async () => {
  const windows = await browser.windows.getAll();

  return (
    windows.find((window) => window.focused)?.id ||
    chrome.windows.WINDOW_ID_NONE
  );
};

const getActiveAudibleTab = () =>
  chrome.tabs.query({
    active: true,
    audible: true,
  });

const getAllActiveTabs = () =>
  chrome.tabs.query({
    active: true,
  });

const getActiveTabFromFocusedWindow = async (
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

const getActiveTabFromWindowId = async (windowId: number) => {
  const [activeTab = null] =
    windowId === browser.windows.WINDOW_ID_NONE
      ? await getActiveAudibleTab()
      : await chrome.tabs.query({
          windowId,
          active: true,
        });

  return activeTab;
};

export const handleActiveTabStateChange = async (
  tabInfo: TabActiveInfo
): Promise<ActiveTabState> => {
  const { windowId, tabId } = tabInfo;

  try {
    const activeTabs = await getAllActiveTabs();
    const focusedWindowAndActiveTab = await getActiveTabFromFocusedWindow(
      windowId,
      tabId
    );

    await createTabsStateTransaction();
    const state = await getTabsStateOrDefault();
    const newState = {
      ...state,
      activeTabs,
      ...focusedWindowAndActiveTab,
    };
    await setTabsState(newState);

    return newState;
  } catch (error) {
    if (isUserDraggingWindowError(error)) {
      return Promise.resolve(handleActiveTabStateChange(tabInfo));
    }

    console.error(error);
    throw error;
  }
};

export const handleTabUpdate = async (tab: Tab) => {
  if (!tab.active) {
    return;
  }

  await createTabsStateTransaction();
  const state = await getTabsStateOrDefault();
  const activeTabs = await getAllActiveTabs();

  const isAudibleAndWindowNotFocused =
    tab.audible && state.focusedWindowId === browser.windows.WINDOW_ID_NONE;

  const isFollowed =
    state.focusedActiveTab?.id === tab.id &&
    state.focusedWindowId !== browser.windows.WINDOW_ID_NONE;

  const focusedActiveTab =
    isFollowed || isAudibleAndWindowNotFocused ? tab : null;

  const newState = {
    ...state,
    activeTabs,
    focusedActiveTab,
  };
  await setTabsState(newState);

  return newState;
};

export const handleWindowFocusChange = async (
  windowId: number
): Promise<ActiveTabState> => {
  try {
    const focusedActiveTab = await getActiveTabFromWindowId(windowId);
    await createTabsStateTransaction();
    const state = await getTabsStateOrDefault();
    const newState = {
      ...state,
      focusedWindowId: windowId,
      focusedActiveTab,
    };
    await setTabsState(newState);

    return newState;
  } catch (error) {
    if (isUserDraggingWindowError(error)) {
      return Promise.resolve(handleWindowFocusChange(windowId));
    }

    console.error(error);
    throw error;
  }
};

export const handleIdleStateChange = async (newIdleState: IdleState) => {
  const tx = await createTabsStateTransaction();
  const state = await getTabsStateOrDefault();
  const newState = {
    ...state,
    idleState: newIdleState,
  };

  await setTabsState(newState);
  tx.commit();

  return newState;
};

export const handleAlarm = async () => {
  const state = await getTabsStateOrDefault();
  // Windows focus change handler does not work, so we do it manually by polling
  const focusedWindowId = await getFocusedWindowId();

  if (focusedWindowId !== state.focusedWindowId) {
    return handleWindowFocusChange(focusedWindowId);
  }

  const focusedActiveTab = await getActiveTabFromWindowId(focusedWindowId);

  if (focusedActiveTab?.id !== state.focusedActiveTab?.id) {
    await createTabsStateTransaction();

    const newState = {
      ...state,
      focusedActiveTab,
    };

    await setTabsState(newState);

    return newState;
  }

  return state;
};
