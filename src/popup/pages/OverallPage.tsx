import * as React from 'react';

import { getFocusedTab } from '../../background/browser-api/tabs';
import { getIsoDate, getMinutesInMs } from '../../shared/utils/dates-helper';

import { TimeUsagePanel } from '../components/DailyTimeUsage/DailyTimeUsage';
import { GeneralTimeline } from '../components/GeneralTimeline/GeneralTimeline';
import { OverallActivityCalendarPanel } from '../components/OverallActivityCalendar/OverallActivtyCalendar';
import { useActiveTabTime } from '../hooks/useActiveTabTime';
import { useLastSixHoursTimelineEvents } from '../hooks/useLastSixHoursTimeline';
import { AppStore } from '../hooks/useTimeStore';
import { useTotalWebsiteActivity } from '../hooks/useTotalWebsiteActivity';

export interface OverallPageProps {
  store: AppStore;
  onNavigateToActivityPage: React.ComponentProps<
    typeof OverallActivityCalendarPanel
  >['navigateToDateActivityPage'];
}

const MINUTE_IN_MS = getMinutesInMs(1);

export const OverallPage: React.FC<OverallPageProps> = ({
  store,
  onNavigateToActivityPage,
}) => {
  const { todaysUsage, weeklyUsage } = useTotalWebsiteActivity(store);
  const timelineEvents = useLastSixHoursTimelineEvents();
  const { host, time } = useActiveTabTime(store);

  return (
    <div>
      {todaysUsage > MINUTE_IN_MS ? (
        <TimeUsagePanel
          title="Surfed Today"
          time={todaysUsage}
          averageTime={weeklyUsage / 7}
          averageTimeComparedTo="last 7 days average"
        />
      ) : null}
      {time ? (
        <TimeUsagePanel
          title={`Surfed on ${host}`}
          time={time}
          averageTime={weeklyUsage / 7}
          averageTimeComparedTo="last 7 days average"
        />
      ) : null}
      <OverallActivityCalendarPanel
        store={store}
        navigateToDateActivityPage={onNavigateToActivityPage}
      />
      <GeneralTimeline
        title="Activity in last 6 hours"
        activityTimeline={timelineEvents}
        filteredHostname={null}
        emptyHoursMarginCount={0}
      />
    </div>
  );
};
