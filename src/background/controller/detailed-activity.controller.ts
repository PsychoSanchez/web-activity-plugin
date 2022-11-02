import { Tabs } from 'webextension-polyfill-ts';

import { getIsoDate, getMinutesInMs } from '../../shared/dates-helper';

import {
  saveActivityTimelineRecord,
  TimelineRecord,
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
  private currentTimelineRecord: TimelineRecord | null = null;

  onActivityStart: ActivityStartEventListener = (tab, startTimestamp) => {
    if (this.currentTimelineRecord?.url !== tab.url) {
      this.saveCurrentTimelineRecord();
      this.createNewTimelineRecord(tab, startTimestamp);
    }

    return (endTimestamp) => {
      // Skip impossibly long events
      if (endTimestamp - startTimestamp > FIVE_MINUTES) {
        this.saveCurrentTimelineRecord();
        return;
      }

      if (this.currentTimelineRecord) {
        this.currentTimelineRecord.activityPeriodEnd = endTimestamp;
      }
    };
  };

  onInactivityStart: InactivityStartEventListener = () => {
    this.saveCurrentTimelineRecord();

    return () => { };
  };

  private saveCurrentTimelineRecord() {
    if (this.currentTimelineRecord === null) {
      return;
    }

    const currentDate = new Date();
    const currentIsoDate = getIsoDate(currentDate);

    if (this.currentTimelineRecord.date === currentIsoDate) {
      saveActivityTimelineRecord(this.currentTimelineRecord);
    } else {
      // Event started before midnight and finished after
      const midnightToday = new Date(currentIsoDate).setHours(0);
      const millisecondBeforeMidnight = midnightToday - 1;

      // We need to split dates into 2 events for iso date index to work
      const yesterdayTimeline = { ...this.currentTimelineRecord };
      yesterdayTimeline.activityPeriodEnd = millisecondBeforeMidnight;
      saveActivityTimelineRecord(yesterdayTimeline);

      this.currentTimelineRecord.activityPeriodStart = midnightToday;
      this.currentTimelineRecord.date = currentIsoDate;

      saveActivityTimelineRecord(this.currentTimelineRecord);
    }

    this.currentTimelineRecord = null;
  }

  private createNewTimelineRecord = (tab: Tabs.Tab, eventTs: number) => {
    const date = getIsoDate(new Date(eventTs));
    const { url = '', title = '', favIconUrl } = tab;
    const hostname = getHostNameFromUrl(url);

    this.currentTimelineRecord = {
      url,
      hostname,
      docTitle: title,
      favIconUrl,
      date,
      activityPeriodStart: eventTs,
      activityPeriodEnd: eventTs,
    };
  };
}
