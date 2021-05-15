import { browser, Tabs } from 'webextension-polyfill-ts';

export type ActiveTabTrackerListener = (
  newTab: Tabs.Tab | undefined,
  previousTab: Tabs.Tab | undefined
) => void;

export class ActiveTabTracker {
  private handlers = new Map<
    Function,
    [
      (tabInfo: number | chrome.tabs.TabActiveInfo) => Promise<void>,
      (windowId: number) => void
    ]
  >();
  private lastActiveTabId: number | null = null;

  async getActiveTab() {
    const lastFocusedWindow = await browser.windows.getLastFocused();

    if (!lastFocusedWindow?.id) {
      return undefined;
    }

    return await this.getWindowActiveTab(lastFocusedWindow.id);
  }

  private async getWindowActiveTab(windowId: number) {
    const [tab] =
      (await browser.tabs.query({
        windowId: windowId,
        active: true,
      })) || [];

    return tab;
  }

  async getCachedLastActiveTab() {
    if (!this.lastActiveTabId) {
      return undefined;
    }

    return await browser.tabs.get(this.lastActiveTabId);
  }

  addListener(listener: ActiveTabTrackerListener) {
    if (this.handlers.has(listener)) {
      console.warn('Listner already exist');
      return;
    }

    const activeTabChangeHandler = async (
      tabInfo: number | chrome.tabs.TabActiveInfo
    ) => {
      if (typeof tabInfo === 'number' && this.lastActiveTabId !== tabInfo) {
        return;
      }

      const previousTab = await this.getCachedLastActiveTab();

      this.lastActiveTabId =
        typeof tabInfo === 'number' ? tabInfo : tabInfo.tabId;

      const tab = await this.getCachedLastActiveTab();
      listener(tab, previousTab);
    };

    const windowFocusChangeHandler = async (windowId: number) => {
      if (windowId === browser.windows.WINDOW_ID_NONE) {
        const tab = await this.getCachedLastActiveTab();

        listener(undefined, tab);

        this.lastActiveTabId = null;

        return;
      }

      const previousTab = await this.getCachedLastActiveTab();
      const newTab = await this.getWindowActiveTab(windowId);

      this.lastActiveTabId = newTab?.id || null;

      listener(newTab, previousTab);
    };

    this.handlers.set(listener, [
      activeTabChangeHandler,
      windowFocusChangeHandler,
    ]);

    browser.tabs.onActivated.addListener(activeTabChangeHandler);
    browser.tabs.onUpdated.addListener(activeTabChangeHandler);
    browser.windows.onFocusChanged.addListener(windowFocusChangeHandler);
  }

  removeListner(listener: ActiveTabTrackerListener) {
    if (!this.handlers.has(listener)) {
      console.warn('No listner');
      return;
    }

    const [tabsListener, windowFocusListener] = this.handlers.get(listener)!;

    browser.tabs.onActivated.removeListener(tabsListener);
    browser.tabs.onUpdated.removeListener(tabsListener);
    browser.windows.onFocusChanged.removeListener(windowFocusListener);

    this.handlers.delete(listener);
  }
}
