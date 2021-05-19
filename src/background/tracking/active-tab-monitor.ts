import { Alarms, browser, Idle, Tabs, Windows } from 'webextension-polyfill-ts';

const ACTIVE_TAB_CHECK_ALARM_NAME = 'active-tab-check-interval';
const ACTIVE_TAB_CHECK_WINDOW_INTERVAL = 10000;
const DEFAULT_ACTIVE_TAB_STATE: ActiveTabState = {
  activeTab: null,
  focusedWindowId: browser.windows.WINDOW_ID_NONE,
  idleState: 'active',
};

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
type ActiveTabStateChangeHandler = (state: ActiveTabState) => void;

export type ActiveTabState = {
  activeTab: Tabs.Tab | null;
  focusedWindowId: number;
  idleState: Idle.IdleState;
};

export class WindowActiveTabStateMonitor {
  private state = DEFAULT_ACTIVE_TAB_STATE;
  private transactionChain = Promise.resolve();
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
    const wrapInTransactionChain =
      (handler: (...args: any[]) => any) =>
      (...args: any[]) => {
        this.transactionChain = this.transactionChain
          .then(() => handler(...args))
          .catch(console.error);
      };

    browser.tabs.onActivated.addListener(
      wrapInTransactionChain(this.activeTabChangeHandler)
    );
    browser.tabs.onUpdated.addListener(
      wrapInTransactionChain(this.tabUpdateHandler)
    );
    // onFocusChanged does not work in Windows 7/8/10 when user alt-tabs or clicks away
    browser.windows.onFocusChanged.addListener(
      wrapInTransactionChain(this.windowFocusChangeHandler)
    );
    browser.idle.onStateChanged.addListener(
      wrapInTransactionChain(this.idleStateChangeHandler)
    );

    browser.alarms.onAlarm.addListener(
      wrapInTransactionChain(this.alarmHandler)
    );
    // SetInterval in background is inconsistent and might not work as expected but it is necessary for window focus polling
    setInterval(
      () =>
        wrapInTransactionChain(this.alarmHandler)({
          name: ACTIVE_TAB_CHECK_ALARM_NAME,
        }),
      ACTIVE_TAB_CHECK_WINDOW_INTERVAL
    );
  }

  removeActivityListeners() {
    browser.tabs.onActivated.removeListener(this.activeTabChangeHandler);
    browser.tabs.onUpdated.removeListener(this.tabUpdateHandler);
    browser.windows.onFocusChanged.removeListener(
      this.windowFocusChangeHandler
    );
    // browser.windows.onRemoved ?
    browser.alarms.onAlarm.removeListener(this.alarmHandler);
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

    const tabs = await browser.tabs.query({
      windowId,
    });

    const activeTab = tabs.find((tab) => tabId === tab.id) || null;

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

  private windowFocusChangeHandler: FocusedWindowChangeHandler = async (
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

  private alarmHandler: AlarmHandler = async (alarm) => {
    if (alarm.name !== ACTIVE_TAB_CHECK_ALARM_NAME) {
      return;
    }

    // Windows focus change handler does not work, so we do it manually by polling
    const focusedWindowId = await getFocusedWindowId();

    if (focusedWindowId !== this.state.focusedWindowId) {
      await this.windowFocusChangeHandler(focusedWindowId);
    }

    if (this.state.focusedWindowId === browser.windows.WINDOW_ID_NONE) {
      const [activeAudibleTab = null] = await getActiveAudibleTab();

      this.setState({
        focusedWindowId: browser.windows.WINDOW_ID_NONE,
        activeTab: activeAudibleTab,
      });

      return;
    }

    const [lastActiveTab = null] = await browser.tabs.query({
      windowId: this.state.focusedWindowId,
      active: true,
    });

    this.setState({
      focusedWindowId: this.state.focusedWindowId,
      activeTab: lastActiveTab,
    });
  };
}

const getFocusedWindowId = () => {
  return browser.windows
    .getAll()
    .then(
      (windows) =>
        windows.find((window) => window.focused)?.id ||
        browser.windows.WINDOW_ID_NONE
    );
};

const getActiveAudibleTab = () =>
  browser.tabs.query({
    active: true,
    audible: true,
  });

// remember last active tab
// if idle state changes to idle clear stopwatch and send time
// while state is idle (user did not interact for a minute) and last active tab audible keep sending heartbeats
// do not track time in locked state
// once idle state changes back to active, start track last active tab again
