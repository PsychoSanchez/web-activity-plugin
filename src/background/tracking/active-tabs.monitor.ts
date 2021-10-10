import { Alarms, browser, Idle, Tabs, Windows } from 'webextension-polyfill-ts';

type ActiveTabChangeHandler = Parameters<
  Tabs.Static['onActivated']['addListener']
>[0];
type ActiveTabChangeHandlerWithEventTimestamp = (
  activeInfo: Parameters<ActiveTabChangeHandler>[0],
  originalEventTimestamp?: number
) => ReturnType<ActiveTabChangeHandler>;
type FocusedWindowChangeHandler = Parameters<
  Windows.Static['onFocusChanged']['addListener']
>[0];
type FocusedWindowChangeHandlerWithTimestamp = (
  windowId: Parameters<FocusedWindowChangeHandler>[0],
  originalEventTimestamp?: number
) => ReturnType<FocusedWindowChangeHandler>;
type AlarmHandler = Parameters<Alarms.Static['onAlarm']['addListener']>[0];
type IdleStateChangeHandler = Parameters<
  Idle.Static['onStateChanged']['addListener']
>[0];
type TabUpdateHandler = Parameters<Tabs.onUpdatedEvent['addListener']>[0];
type ActiveTabStateChangeHandler = (
  state: ActiveTabState,
  eventTimestamp: number
) => void;

export type ActiveTabState = {
  activeTabs: Tabs.Tab[];
  focusedActiveTab: Tabs.Tab | null;
  focusedWindowId: number;
  idleState: Idle.IdleState;
};

const ACTIVE_TAB_CHECK_ALARM_NAME = 'active-tab-check-interval';
const ACTIVE_TAB_CHECK_WINDOW_INTERVAL = 10000;
const DEFAULT_ACTIVE_TAB_STATE: ActiveTabState = {
  activeTabs: [],
  focusedActiveTab: null,
  focusedWindowId: browser.windows.WINDOW_ID_NONE,
  idleState: 'active',
};

const getFocusedWindowId = async () => {
  const windows = await browser.windows.getAll();

  return (
    windows.find((window) => window.focused)?.id ||
    browser.windows.WINDOW_ID_NONE
  );
};

const getActiveAudibleTab = () =>
  browser.tabs.query({
    active: true,
    audible: true,
  });

const getAllActiveTabs = () =>
  browser.tabs.query({
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

  const tabs = await browser.tabs.query({
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
      : await browser.tabs.query({
          windowId,
          active: true,
        });

  return activeTab;
};

export class WindowActiveTabStateMonitor {
  private state = DEFAULT_ACTIVE_TAB_STATE;
  private transactionChain = Promise.resolve();
  private stateChangeListener: ActiveTabStateChangeHandler = () => {};

  constructor() {
    browser.alarms.create(ACTIVE_TAB_CHECK_ALARM_NAME, { periodInMinutes: 1 });
  }

  idleStateChangeHandler: IdleStateChangeHandler = this.wrapInTransactionChain(
    async (idleState) => {
      this.setState({
        idleState,
      });
    }
  );

  activeTabChangeHandler: ActiveTabChangeHandlerWithEventTimestamp =
    this.wrapInTransactionChain(
      async (tabInfo, originalEventTimestamp = Date.now()) => {
        const { windowId, tabId } = tabInfo;

        try {
          const activeTabs = await getAllActiveTabs();
          const focusedWindowAndActiveTab = await getActiveTabFromFocusedWindow(
            windowId,
            tabId
          );

          this.setState(
            {
              activeTabs,
              ...focusedWindowAndActiveTab,
            },
            originalEventTimestamp
          );
        } catch (error) {
          if (isUserDragError(error)) {
            setTimeout(
              () =>
                this.activeTabChangeHandler(tabInfo, originalEventTimestamp),
              50
            );
          }
        }
      }
    );

  tabUpdateHandler: TabUpdateHandler = this.wrapInTransactionChain(
    async (_1, _2, tab) => {
      if (!tab.active) {
        return;
      }

      const activeTabs = await getAllActiveTabs();

      const isAudibleAndWindowNotFocused =
        tab.audible &&
        this.state.focusedWindowId === browser.windows.WINDOW_ID_NONE;

      const isFollowed =
        this.state.focusedActiveTab?.id === tab.id &&
        this.state.focusedWindowId !== browser.windows.WINDOW_ID_NONE;

      const focusedActiveTab =
        isFollowed || isAudibleAndWindowNotFocused ? tab : null;

      this.setState({
        activeTabs,
        focusedActiveTab,
      });
    }
  );

  private _windowFocusChangeHandler: FocusedWindowChangeHandlerWithTimestamp =
    async (focusedWindowId, originalEventTimestamp = Date.now()) => {
      try {
        const focusedActiveTab = await getActiveTabFromWindowId(
          focusedWindowId
        );
        this.setState(
          {
            focusedWindowId,
            focusedActiveTab,
          },
          originalEventTimestamp
        );
      } catch (error) {
        if (isUserDragError(error)) {
          setTimeout(
            () =>
              this._windowFocusChangeHandler(
                focusedWindowId,
                originalEventTimestamp
              ),
            50
          );
        }
      }
    };

  windowFocusChangeHandler: FocusedWindowChangeHandler =
    this.wrapInTransactionChain(this._windowFocusChangeHandler);

  alarmHandler: AlarmHandler = this.wrapInTransactionChain(async (alarm) => {
    if (alarm.name !== ACTIVE_TAB_CHECK_ALARM_NAME) {
      return;
    }

    // Windows focus change handler does not work, so we do it manually by polling
    const focusedWindowId = await getFocusedWindowId();

    if (focusedWindowId !== this.state.focusedWindowId) {
      await this._windowFocusChangeHandler(focusedWindowId);
    }

    const focusedActiveTab = await getActiveTabFromWindowId(
      this.state.focusedWindowId
    );

    this.setState({
      focusedWindowId: this.state.focusedWindowId,
      focusedActiveTab,
    });
  });

  private wrapInTransactionChain<T extends (...args: any[]) => any>(
    handler: T
  ): T {
    return ((...args) => {
      this.transactionChain = this.transactionChain
        .then(() => handler(...args))
        .catch(console.error);
    }) as T;
  }

  onStateChange(handler: ActiveTabStateChangeHandler) {
    this.stateChangeListener = handler;
  }

  async init() {
    try {
      const window = await browser.windows.getLastFocused();
      const [tab = null] = await browser.tabs.query({
        windowId: window.id,
        active: true,
      });

      this.setState({
        focusedWindowId: window.id,
        focusedActiveTab: tab,
      });
    } catch (error) {
      console.error('Failed to initialize tab monitor: ', error?.message);
    }

    this.addBrowserActivityListeners();
  }

  private addBrowserActivityListeners() {
    browser.tabs.onActivated.addListener(this.activeTabChangeHandler);
    browser.tabs.onUpdated.addListener(this.tabUpdateHandler);
    // onFocusChanged does not work in Windows 7/8/10 when user alt-tabs or clicks away
    browser.windows.onFocusChanged.addListener(this.windowFocusChangeHandler);
    browser.idle.onStateChanged.addListener(this.idleStateChangeHandler);

    browser.alarms.onAlarm.addListener(this.alarmHandler);
    setInterval(this.intervalHandler, ACTIVE_TAB_CHECK_WINDOW_INTERVAL);
  }

  intervalHandler = () =>
    this.wrapInTransactionChain(this.alarmHandler)({
      name: ACTIVE_TAB_CHECK_ALARM_NAME,
    } as Alarms.Alarm);

  private removeActivityListeners() {
    browser.tabs.onActivated.removeListener(this.activeTabChangeHandler);
    browser.tabs.onUpdated.removeListener(this.tabUpdateHandler);
    browser.windows.onFocusChanged.removeListener(
      this.windowFocusChangeHandler
    );
    // browser.windows.onRemoved ?
    browser.alarms.onAlarm.removeListener(this.alarmHandler);
    browser.idle.onStateChanged.removeListener(this.idleStateChangeHandler);
  }

  private setState(newState: Partial<ActiveTabState>, eventTimestamp?: number) {
    this.state = {
      ...this.state,
      ...newState,
    };

    this.stateChangeListener(this.state, eventTimestamp ?? Date.now());
  }
}

function isUserDragError(error: any) {
  return error.message.indexOf('user may be dragging a tab') > -1;
}
// remember last active tab
// if idle state changes to idle clear stopwatch and send time
// while state is idle (user did not interact for a minute) and last active tab audible keep sending heartbeats
// do not track time in locked state
// once idle state changes back to active, start track last active tab again
