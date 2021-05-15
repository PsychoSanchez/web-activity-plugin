import { browser, Tabs } from 'webextension-polyfill-ts';
import { debounce } from 'debounce';

export type ActiveTabTrackerListener = (newTab: Tabs.Tab | undefined) => void;

type ActiveTabChangeHandler = (
  tabInfo: number | chrome.tabs.TabActiveInfo
) => Promise<void>;

type FocusedWindowChangeHandler = (windowId: number) => void;

const LISTENER_DEBOUNCE_PERIOD = 1000;

export class ActiveTabTracker {
  private handlers = new Map<
    Function,
    [ActiveTabChangeHandler, FocusedWindowChangeHandler]
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

    const debouncedListener = debounce(listener, LISTENER_DEBOUNCE_PERIOD);

    const activeTabChangeHandler =
      this.createActiveTabChangeHandler(debouncedListener);
    const windowFocusChangeHandler =
      this.createWindowFocusChangeHandler(debouncedListener);

    browser.tabs.onActivated.addListener(activeTabChangeHandler);
    browser.tabs.onUpdated.addListener(activeTabChangeHandler);
    browser.windows.onFocusChanged.addListener(windowFocusChangeHandler);

    this.handlers.set(listener, [
      activeTabChangeHandler,
      windowFocusChangeHandler,
    ]);
  }

  private createActiveTabChangeHandler(
    listener: ActiveTabTrackerListener
  ): ActiveTabChangeHandler {
    return async (tabInfo) => {
      if (typeof tabInfo === 'number' && this.lastActiveTabId !== tabInfo) {
        return;
      }

      const newPageTabId =
        typeof tabInfo === 'number' ? tabInfo : tabInfo.tabId;

      this.lastActiveTabId = newPageTabId;

      const tab = await this.getCachedLastActiveTab();
      listener(tab);
    };
  }

  private createWindowFocusChangeHandler(
    listener: ActiveTabTrackerListener
  ): FocusedWindowChangeHandler {
    return async (windowId) => {
      if (windowId === browser.windows.WINDOW_ID_NONE) {
        listener(undefined);

        this.lastActiveTabId = null;

        return;
      }

      const newTab = await this.getWindowActiveTab(windowId);

      this.lastActiveTabId = newTab?.id || null;

      listener(newTab);
    };
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
