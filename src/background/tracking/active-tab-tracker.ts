import { Alarms, browser, Idle, Tabs } from 'webextension-polyfill-ts';

export type ActiveTabTrackerListener = (newTab: Tabs.Tab | undefined) => void;

type ActiveTabChangeHandler = Parameters<
  Tabs.Static['onActivated']['addListener']
>[0];
type FocusedWindowChangeHandler = (windowId: number) => void;
type AlarmHandler = (name: Alarms.Alarm) => void;
type IdleStateChangeHandler = (state: Idle.IdleState) => void;
type TabUpdateHandler = Parameters<Tabs.onUpdatedEvent['addListener']>[0];

const ACTIVE_TAB_CHECK_ALARM_NAME = 'active-tab-check-interval';

export type ActiveTabState = {
  lastActiveTab: Tabs.Tab | null;
  focusedWindowId: number;
  idleState: Idle.IdleState;
};

const DEFAULT_ACTIVE_TAB_STATE: ActiveTabState = {
  lastActiveTab: null,
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
      lastActiveTab: tab,
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
    // browser.tabs.onRemoved
    browser.windows.onFocusChanged.removeListener(this.windowFocusChangeHadler);
    // browser.windows.onRemoved
    browser.alarms.onAlarm.removeListener(this.activeTabAlarmHandler);
    browser.idle.onStateChanged.removeListener(this.idleStateChangeHandler);
    // browser.idle.
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
    const eventWindow = await browser.windows.get(windowId);
    if (!eventWindow.focused) {
      return;
    }
    const tabs = await browser.tabs.query({
      windowId,
    });

    const activeTab = tabs.find((tab) => tabId === tab.id) || null;

    this.setState({
      focusedWindowId: windowId,
      lastActiveTab: activeTab,
    });
  };

  private tabUpdateHandler: TabUpdateHandler = (_1, _2, tab) => {
    const isActiveAndFollowedTab =
      tab.active &&
      this.state.lastActiveTab?.windowId === tab.windowId &&
      this.state.lastActiveTab?.id === tab.id;

    if (isActiveAndFollowedTab) {
      this.setState({
        lastActiveTab: tab,
      });
    }
  };

  private windowFocusChangeHadler: FocusedWindowChangeHandler = async (
    windowId
  ) => {
    if (windowId === browser.windows.WINDOW_ID_NONE) {
      this.setState({
        focusedWindowId: windowId,
        lastActiveTab: null,
      });

      return;
    }

    const [activeTab = null] = await browser.tabs.query({
      windowId,
      active: true,
    });

    this.setState({
      focusedWindowId: windowId,
      lastActiveTab: activeTab,
    });
  };

  private activeTabAlarmHandler: AlarmHandler = async (alarm) => {
    if (alarm.name !== ACTIVE_TAB_CHECK_ALARM_NAME) {
      return;
    }

    if (
      this.state.focusedWindowId === browser.windows.WINDOW_ID_NONE ||
      this.state.lastActiveTab === null
    ) {
      return;
    }

    const [activeTab = null] = await browser.tabs.query({
      windowId: this.state.focusedWindowId,
      active: true,
    });

    if (activeTab?.id === this.state.lastActiveTab?.id) {
      this.setState({
        lastActiveTab: activeTab,
      });
    }
  };
}

// remember last active tab
// if idle state changes to idle clear stopwatch and send time
// while state is idle (user did not interract for a minute) and last active tab audible keep sending heartbeats
// do not track time in locked state
// once idle state changes back to active, start track last active tab again
