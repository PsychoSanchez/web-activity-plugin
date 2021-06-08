import { BrowserSyncStorage } from '../../shared/browser-sync-storage';
import { getMinutesInMs } from '../../shared/dates-helper';

import { addActivityTimeToHost } from '../storage/accumulated-daily-activity';

import { ActiveTabState } from './active-tabs.monitor';
import { createTimelineTrackerVisitor } from './timeline-tracker-visitor';

const FIVE_MINUTES = getMinutesInMs(5);

type FinishTrackingEvent = () => void;

const timelineTracker = createTimelineTrackerVisitor();

const startUrlTracker = (
  url: string,
  storage: BrowserSyncStorage
): FinishTrackingEvent => {
  const finishTracking = timelineTracker.startActivityTracker(url);

  const trackingStartDate = Date.now();
  const { hostname } = new URL(url);

  const savedHostname = hostname || url;
  console.log(savedHostname, 'Active');

  return () => {
    const activityTime = Date.now() - trackingStartDate;

    // Skip impossibly long events
    if (activityTime > FIVE_MINUTES) {
      return;
    }

    finishTracking();

    console.log(savedHostname, activityTime);

    addActivityTimeToHost(storage, savedHostname, activityTime);
  };
};

const startEmptyTracker = (): FinishTrackingEvent => {
  const finishTracking = timelineTracker.startInactivityTracker();
  console.log('Inactive');

  return () => {
    finishTracking();
  };
};

const isInvalidUrl = (url: string | undefined): url is undefined => {
  return (
    !url ||
    ['chrome', 'about', 'opera', 'edge', 'coccoc', 'yabro'].some((broName) =>
      url.startsWith(broName)
    )
  );
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
