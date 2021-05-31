import { getIsoDate } from '../../shared/dates-helper';

import { saveTimeline, TimelineRecord } from '../storage/timeline-storage';

const getHostNameFromUrl = (url: string) => {
  const { hostname } = new URL(url);

  return hostname || url;
};

export const createTimelineTrackerVisitor = () => {
  let currentTimeline: TimelineRecord | null = null;

  const saveCurrentTimelinePeriod = () => {
    if (currentTimeline !== null) {
      saveTimeline(currentTimeline);
    }

    currentTimeline = null;
  };

  const createNewTimelinePeriod = (url: string) => {
    const now = Date.now();
    const date = getIsoDate(new Date(now));
    const hostname = getHostNameFromUrl(url);

    currentTimeline = {
      url,
      hostname,
      date,
      activityPeriod: [now, now],
    };
  };

  const updateCurrentTimelinePeriodEndDate = () => {
    if (!currentTimeline) {
      return;
    }

    currentTimeline.activityPeriod[1] = Date.now();
  };

  return {
    startActivityTracker: (url: string) => {
      if (currentTimeline?.hostname !== getHostNameFromUrl(url)) {
        saveCurrentTimelinePeriod();
        createNewTimelinePeriod(url);
      }

      return updateCurrentTimelinePeriodEndDate;
    },
    startInactivityTracker: () => {
      saveCurrentTimelinePeriod();

      return () => {};
    },
  };
};
