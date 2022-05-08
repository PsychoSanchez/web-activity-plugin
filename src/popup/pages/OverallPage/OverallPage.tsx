import * as React from 'react';

import { TimeUsagePanel } from '../../../components/DailyTimeUsage/DailyTimeUsage';
import { GeneralTimeline } from '../../../components/GeneralTimeline/GeneralTimeline';
import { OverallActivityCalendarPanel } from '../../../components/OverallActivityCalendar/OverallActivtyCalendar';
import { useLastSixHoursTimelineEvents } from '../../../hooks/useLastSixHoursTimeline';
import { useTotalWebsiteActivity } from '../../../hooks/useTotalWebsiteActivity';
import { getMinutesInMs } from '../../../shared/dates-helper';

import { OverallPageProps } from './types';

const MINUTE_IN_MS = getMinutesInMs(1);

export const OverallPage: React.FC<OverallPageProps> = ({
  store,
  onNavigateToActivityPage,
}) => {
  const { todaysUsage, weeklyUsage } = useTotalWebsiteActivity(store);
  const timelineEvents = useLastSixHoursTimelineEvents();

  return (
    <div>
      {todaysUsage > MINUTE_IN_MS ? (
        <TimeUsagePanel
          title={'Surfed Today'}
          time={todaysUsage}
          averageTime={weeklyUsage / 7}
          averageTimeComparedTo={'last 7 days average'}
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
