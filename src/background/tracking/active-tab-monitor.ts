import { Alarms, browser, Idle, Tabs, Windows } from 'webextension-polyfill-ts';

export type ActiveTabTrackerListener = (newTab: Tabs.Tab | undefined) => void;

type ActiveTabChangeHandler = Parameters<
  Tabs.Static['onActivated']['addListener']
>[0];
type FocusedWindowChangeHandler = Parameters<
  Windows.Static['onFocusChanged']['addListener']
>[0];
type AlarmHandler = Parameters<Alarms.Static['onAlarm']['addListener']>[0];
type IdleStateChangeHandler = Parameters<
  Idle.Static['onStateChanged']['addListener']
>[0];
type TabUpdateHandler = Parameters<Tabs.onUpdatedEvent['addListener']>[0];

const ACTIVE_TAB_CHECK_ALARM_NAME = 'active-tab-check-interval';

export type ActiveTabState = {
  activeTab: Tabs.Tab | null;
  focusedWindowId: number;
  idleState: Idle.IdleState;
};

const DEFAULT_ACTIVE_TAB_STATE: ActiveTabState = {
  activeTab: null,
  focusedWindowId: browser.windows.WINDOW_ID_NONE,
  idleState: 'active',
};

type ActiveTabStateChangeHandler = (state: ActiveTabState) => void;

export class WindowActiveTabStateMonitor {
  private state = DEFAULT_ACTIVE_TAB_STATE;
  private stateChangeListener: ActiveTabStateChangeHandler = () => {};

  onStateChange(handler: ActiveTabStateChangeHandler) {
    this.stateChangeListener = handler;
  }

  async init() {
    const window = await browser.windows.getLastFocused();
    const [tab = null] = await browser.tabs.query({
      windowId: window.id,
      active: true,
    });

    this.setState({
      focusedWindowId: window.id,
      activeTab: tab,
    });

    this.addBrowserActivityListeners();
  }

  addBrowserActivityListeners() {
    browser.tabs.onActivated.addListener(this.activeTabChangeHandler);
    browser.tabs.onUpdated.addListener(this.tabUpdateHandler);
    browser.windows.onFocusChanged.addListener(this.windowFocusChangeHadler);
    browser.alarms.onAlarm.addListener(this.activeTabAlarmHandler);
    browser.idle.onStateChanged.addListener(this.idleStateChangeHandler);
  }

  removeActivityListeners() {
    browser.tabs.onActivated.removeListener(this.activeTabChangeHandler);
    browser.tabs.onUpdated.removeListener(this.tabUpdateHandler);
    browser.windows.onFocusChanged.removeListener(this.windowFocusChangeHadler);
    // browser.windows.onRemoved ?
    browser.alarms.onAlarm.removeListener(this.activeTabAlarmHandler);
    browser.idle.onStateChanged.removeListener(this.idleStateChangeHandler);
  }

  setState(newState: Partial<ActiveTabState>) {
    this.state = {
      ...this.state,
      ...newState,
    };

    this.stateChangeListener(this.state);
  }

  private idleStateChangeHandler: IdleStateChangeHandler = async (
    idleState
  ) => {
    this.setState({
      idleState,
    });
  };

  private activeTabChangeHandler: ActiveTabChangeHandler = async (tabInfo) => {
    const { windowId, tabId } = tabInfo;
    const activeTabWindow = await browser.windows.get(windowId);
    if (!activeTabWindow.focused) {
      return;
    }

    const activeTab =
      activeTabWindow.tabs?.find((tab) => tabId === tab.id) ?? null;

    this.setState({
      focusedWindowId: windowId,
      activeTab: activeTab,
    });
  };

  private tabUpdateHandler: TabUpdateHandler = (_1, _2, tab) => {
    const isActiveAndFollowed =
      tab.active && this.state.activeTab?.id === tab.id;

    if (!isActiveAndFollowed) {
      return;
    }

    const isLastFocusedWindowNoneAndTabNotAudible =
      this.state.focusedWindowId === browser.windows.WINDOW_ID_NONE &&
      !tab.audible;

    if (isLastFocusedWindowNoneAndTabNotAudible) {
      this.setState({
        activeTab: null,
      });

      return;
    }

    this.setState({
      activeTab: tab,
    });
  };

  private windowFocusChangeHadler: FocusedWindowChangeHandler = async (
    windowId
  ) => {
    if (windowId === browser.windows.WINDOW_ID_NONE) {
      const [activeAudibleTab = null] = await getActiveAudibleTab();

      this.setState({
        focusedWindowId: windowId,
        activeTab: activeAudibleTab,
      });

      return;
    }

    const [activeTab = null] = await browser.tabs.query({
      windowId,
      active: true,
    });

    this.setState({
      focusedWindowId: windowId,
      activeTab: activeTab,
    });
  };

  private activeTabAlarmHandler: AlarmHandler = async (alarm) => {
    if (alarm.name !== ACTIVE_TAB_CHECK_ALARM_NAME) {
      return;
    }

    const lastFocusedWindowId = this.state.focusedWindowId;

    if (lastFocusedWindowId === browser.windows.WINDOW_ID_NONE) {
      const [activeAudibleTab = null] = await getActiveAudibleTab();

      this.setState({
        focusedWindowId: lastFocusedWindowId,
        activeTab: activeAudibleTab,
      });

      return;
    }

    const [lastActiveTab = null] = await browser.tabs.query({
      windowId: lastFocusedWindowId,
      active: true,
    });

    this.setState({
      focusedWindowId: lastFocusedWindowId,
      activeTab: lastActiveTab,
    });
  };
}

const getActiveAudibleTab = () =>
  browser.tabs.query({
    active: true,
    audible: true,
  });

// remember last active tab
// if idle state changes to idle clear stopwatch and send time
// while state is idle (user did not interract for a minute) and last active tab audible keep sending heartbeats
// do not track time in locked state
// once idle state changes back to active, start track last active tab again
