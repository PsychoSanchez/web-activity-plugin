import { BrowserSyncStorage } from '../../shared/browser-sync-storage';
import { addActivityTimeToHost } from '../storage/accumulated-daily-activity';
import { ActiveTabState } from './active-tabs.monitor';

type FinishTrackingEvent = () => void;

const startUrlTracker = (
  url: string,
  storage: BrowserSyncStorage
): FinishTrackingEvent => {
  const trackingStartDate = Date.now();
  const { hostname } = new URL(url);

  console.log(hostname, 'Active');

  return () => {
    const activityTime = Date.now() - trackingStartDate;

    console.log(hostname, activityTime);

    addActivityTimeToHost(storage, hostname, activityTime);
  };
};

const startEmptyTracker = (): FinishTrackingEvent => {
  console.log('Inactive');

  return () => {};
};

const isInvalidUrl = (url: string | undefined): url is undefined => {
  return !url || url.startsWith('chrome');
};

export class ActiveTabTracker {
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
    console.log('New State', activeTabState);

    const activeTabUrl = activeTabState.focusedActiveTab?.url;

    if (
      activeTabState.idleState === 'locked' ||
      activeTabState.focusedActiveTab === null ||
      isInvalidUrl(activeTabUrl)
    ) {
      return startEmptyTracker();
    }

    if (activeTabState.idleState === 'idle') {
      return activeTabState.focusedActiveTab.audible
        ? startUrlTracker(activeTabUrl, this.storage)
        : startEmptyTracker();
    }

    return startUrlTracker(activeTabUrl, this.storage);
  }
}
