import type { IdleState, Tab, TabActiveInfo } from '@shared/browser-api.types';
import { ActiveTabState } from '@shared/db/types';
import {
  createTabsStateTransaction,
  getTabsState,
  setTabsState,
} from '@shared/tables/state';

import { isUserDraggingWindowError } from '../browser-api/errors';
import {
  getAllActiveTabs,
  getTabFromFocusedWindow,
  getActiveTabFromWindowId,
} from '../browser-api/tabs';
import { getFocusedWindowId } from '../browser-api/windows';

// remember last active tab
// if idle state changes to idle clear stopwatch and send time
// while state is idle (user did not interact for a minute) and last active tab audible keep sending heartbeats
// do not track time in locked state
// once idle state changes back to active, start track last active tab again

const DEFAULT_ACTIVE_TAB_STATE: ActiveTabState = {
  activeTabs: [],
  focusedActiveTab: null,
  focusedWindowId: chrome.windows.WINDOW_ID_NONE,
  idleState: 'active',
};

async function getTabsStateOrDefault() {
  return (await getTabsState()) ?? DEFAULT_ACTIVE_TAB_STATE;
}

export const handleActiveTabStateChange = async (
  tabInfo: TabActiveInfo,
): Promise<ActiveTabState> => {
  const { windowId, tabId } = tabInfo;

  try {
    const [activeTabs, focusedWindowAndActiveTab] = await Promise.all([
      getAllActiveTabs(),
      getTabFromFocusedWindow(windowId, tabId),
    ]);

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

  const activeTabs = await getAllActiveTabs();

  await createTabsStateTransaction();
  const state = await getTabsStateOrDefault();
  const isAudibleAndWindowNotFocused =
    tab.audible && state.focusedWindowId === chrome.windows.WINDOW_ID_NONE;

  const isFollowed =
    state.focusedActiveTab?.id === tab.id &&
    state.focusedWindowId !== chrome.windows.WINDOW_ID_NONE;

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
  windowId: number,
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
  await createTabsStateTransaction();
  const state = await getTabsStateOrDefault();
  const newState = {
    ...state,
    idleState: newIdleState,
  };
  await setTabsState(newState);

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
