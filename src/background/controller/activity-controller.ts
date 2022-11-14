import { getIsoDate, getMinutesInMs } from '../../shared/dates-helper';

import { saveActivityTimelineRecord } from '../tables/activity-timeline';
import { ActiveTabState, TimelineRecord } from '../tables/idb';
import { getActiveTabRecord, setActiveTabRecord } from '../tables/state';

const FIVE_MINUTES = getMinutesInMs(5);

const getHostNameFromUrl = (url: string) => {
  const { hostname } = new URL(url);

  return hostname || url;
};

interface StateChangeVisitor {
  onStateChange: (ts: number) => Promise<void>;
  onActivityStart: (tab: chrome.tabs.Tab, timestamp: number) => Promise<void>;
  onInactivityStart: (timestamp: number) => Promise<void>;
}

export class ActivityStateController implements StateChangeVisitor {
  async onActivityStart(tab: chrome.tabs.Tab, startTimestamp: number) {
    const currentTimelineRecord = await getActiveTabRecord();

    if (currentTimelineRecord?.url !== tab.url) {
      await this.saveCurrentTimelineRecord();
      await this.createNewTimelineRecord(tab, startTimestamp);
    }
  }

  async onStateChange(ts: number) {
    const currentTimelineRecord = await getActiveTabRecord();
    if (!currentTimelineRecord) {
      return;
    }

    if (ts - currentTimelineRecord.activityPeriodStart > FIVE_MINUTES) {
      // Save with last activity timestamp
      await this.saveCurrentTimelineRecord();
      return;
    }

    if (currentTimelineRecord) {
      await setActiveTabRecord({
        ...currentTimelineRecord,
        activityPeriodEnd: ts,
      });
    }
  }

  async onInactivityStart(ts: number) {
    await this.saveCurrentTimelineRecord(ts);
  }

  private async saveCurrentTimelineRecord(eventTs?: number) {
    const currentTimelineRecord = await getActiveTabRecord();
    if (!currentTimelineRecord) {
      return;
    }

    if (eventTs) {
      currentTimelineRecord.activityPeriodEnd = eventTs;
    }

    const currentDate = new Date();
    const currentIsoDate = getIsoDate(currentDate);

    if (currentTimelineRecord.date === currentIsoDate) {
      await saveActivityTimelineRecord(currentTimelineRecord);
      await setActiveTabRecord(null);

      return;
    }

    // Event started before midnight and finished after
    await this.processMidnightEdgeCase(currentIsoDate, currentTimelineRecord);
  }

  private createNewTimelineRecord = async (
    tab: chrome.tabs.Tab,
    eventTs: number
  ) => {
    const date = getIsoDate(new Date(eventTs));
    const { url = '', title = '', favIconUrl } = tab;
    const hostname = getHostNameFromUrl(url);

    await setActiveTabRecord({
      url,
      hostname,
      docTitle: title,
      favIconUrl,
      date,
      activityPeriodStart: eventTs,
      activityPeriodEnd: eventTs,
    });
  };

  private async processMidnightEdgeCase(
    currentIsoDate: string,
    currentTimelineRecord: TimelineRecord
  ) {
    const midnightToday = new Date(currentIsoDate).setHours(0);
    const millisecondBeforeMidnight = midnightToday - 1;

    // We need to split dates into 2 events for iso date index to work
    const yesterdayTimeline = { ...currentTimelineRecord };
    yesterdayTimeline.activityPeriodEnd = millisecondBeforeMidnight;
    await saveActivityTimelineRecord(yesterdayTimeline);

    currentTimelineRecord.activityPeriodStart = midnightToday;
    currentTimelineRecord.date = currentIsoDate;

    await saveActivityTimelineRecord(currentTimelineRecord);
    await setActiveTabRecord(null);
  }

  public async handleStateChange(
    activeTabState: ActiveTabState,
    timestamp: number = Date.now()
  ) {
    console.log('New State', activeTabState);

    await this.onStateChange(timestamp);

    const activeTabUrl = activeTabState.focusedActiveTab?.url;

    if (
      activeTabState.idleState === 'locked' ||
      !activeTabState.focusedActiveTab ||
      isInvalidUrl(activeTabUrl)
    ) {
      return this.onInactivityStart(timestamp);
    }

    const { focusedActiveTab } = activeTabState;

    if (activeTabState.idleState === 'idle') {
      return focusedActiveTab.audible
        ? this.onActivityStart(focusedActiveTab, timestamp)
        : this.onInactivityStart(timestamp);
    }

    return this.onActivityStart(focusedActiveTab, timestamp);
  }
}

const isInvalidUrl = (url: string | undefined): url is undefined => {
  return (
    !url ||
    ['chrome', 'about', 'opera', 'edge', 'coccoc', 'yabro'].some((broName) =>
      url.startsWith(broName)
    )
  );
};
