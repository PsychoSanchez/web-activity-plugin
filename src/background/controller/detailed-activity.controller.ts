import { getIsoDate, getMinutesInMs } from '../../shared/dates-helper';

import {
  getActiveTabRecord,
  setActiveTabRecord,
  saveActivityTimelineRecord,
} from '../storage/timelines';
import {
  ActivityStartEventListener,
  ActiveTabListenerVisitor,
  InactivityStartEventListener,
} from '../tracking/activity.tracker';

const FIVE_MINUTES = getMinutesInMs(5);

const getHostNameFromUrl = (url: string) => {
  const { hostname } = new URL(url);

  return hostname || url;
};

export class DetailedActivityVisitor implements ActiveTabListenerVisitor {
  onActivityStart: ActivityStartEventListener = (tab, startTimestamp) => {
    getActiveTabRecord().then(async (currentTimelineRecord) => {
      if (currentTimelineRecord?.url !== tab.url) {
        await this.saveCurrentTimelineRecord();
        await this.createNewTimelineRecord(tab, startTimestamp);
      }
    });

    return async (endTimestamp) => {
      // Skip impossibly long events
      if (endTimestamp - startTimestamp > FIVE_MINUTES) {
        await this.saveCurrentTimelineRecord();
        return;
      }

      const currentTimelineRecord = await getActiveTabRecord();
      if (currentTimelineRecord) {
        await setActiveTabRecord({
          ...currentTimelineRecord,
          activityPeriodEnd: endTimestamp,
        });
      }
    };
  };

  onInactivityStart: InactivityStartEventListener = () => {
    this.saveCurrentTimelineRecord();

    return () => {};
  };

  private async saveCurrentTimelineRecord() {
    const currentTimelineRecord = await getActiveTabRecord();
    if (!currentTimelineRecord) {
      return;
    }

    const currentDate = new Date();
    const currentIsoDate = getIsoDate(currentDate);

    if (currentTimelineRecord.date === currentIsoDate) {
      await saveActivityTimelineRecord(currentTimelineRecord);
      await setActiveTabRecord(null);

      return;
    }

    // Event started before midnight and finished after
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
}
