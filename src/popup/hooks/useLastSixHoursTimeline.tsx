import { useEffect, useState } from 'react';

import { getActivityTimeline } from '../../background/tables/activity-timeline';
import { TimelineRecord } from '../../shared/db/types';
import { getHoursInMs, getIsoDate } from '../../shared/utils/dates-helper';

export const useLastSixHoursTimelineEvents = () => {
  const [activityEvents, setActivityEvents] = useState<TimelineRecord[]>([]);

  useEffect(() => {
    (async () => {
      const timeline = await getActivityTimeline(getIsoDate(new Date()));
      const sixHoursAgo = Date.now() - getHoursInMs(6);

      const events = timeline.filter(
        (event) => event.activityPeriodStart > sixHoursAgo
      );

      setActivityEvents(events);
    })();
  }, []);

  return activityEvents;
};
