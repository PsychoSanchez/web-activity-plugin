import { addActivityTimeToHost } from './background/storage/accumulated-daily-activity';
import {
  ActiveTabState,
  WindowActiveTabStateMonitor,
} from './background/tracking/active-tab-monitor';
import {
  addGetActivityStoreMessageListener as addRuntimeStoreMessageListener,
  sendMessageWithStoreUpdate,
} from './shared/background-browser-sync-storage';
import {
  BrowserSyncStorage,
  createGlobalSyncStorageListener,
} from './shared/browser-sync-storage';

type FinishTrackingEvent = () => void;

const startUrlTracker = (
  url: string,
  storage: BrowserSyncStorage
): FinishTrackingEvent => {
  const trackingStartDate = Date.now();

  return () => {
    const { hostname } = new URL(url);

    addActivityTimeToHost(storage, hostname, Date.now() - trackingStartDate);
  };
};

const startEmptyTracker = (): FinishTrackingEvent => () => {};

const isInvalidUrl = (url: string | undefined): url is undefined => {
  return !url || url.startsWith('chrome');
};

class ActiveTabTracker {
  private invokeTrackingFinishEvent: FinishTrackingEvent = startEmptyTracker();

  constructor(private storage: BrowserSyncStorage) {}

  trackNewActiveTabState(tabState: ActiveTabState) {
    this.invokeTrackingFinishEvent();

    this.invokeTrackingFinishEvent =
      this.createNewTrackerFromTabState(tabState);
  }

  private createNewTrackerFromTabState(
    activeTabState: ActiveTabState
  ): FinishTrackingEvent {
    const activeTabUrl = activeTabState.lastActiveTab?.url;
    if (
      activeTabState.idleState === 'locked' ||
      activeTabState.lastActiveTab === null ||
      isInvalidUrl(activeTabUrl)
    ) {
      return startEmptyTracker();
    }

    if (activeTabState.idleState === 'idle') {
      return activeTabState.lastActiveTab.audible
        ? startUrlTracker(activeTabUrl, this.storage)
        : startEmptyTracker();
    }

    return startUrlTracker(activeTabUrl, this.storage);
  }
}

try {
  const storage = createGlobalSyncStorageListener();
  const activeTabTracker = new ActiveTabTracker(storage);
  const activeTabMonitor = new WindowActiveTabStateMonitor();

  activeTabMonitor.init().then(() => {
    activeTabMonitor.onStateChange((newState) =>
      activeTabTracker.trackNewActiveTabState(newState)
    );
  });

  addRuntimeStoreMessageListener(storage);
  storage.onChanged(sendMessageWithStoreUpdate);
} catch (error) {
  console.error(error);
}
