import * as React from 'react';

import { useLastSixHoursTimelineEvents } from '../../hooks/useLastSixHoursTimeline';
import { useTotalWebsiteActivity } from '../../hooks/useTotalWebsiteActivity';
import { getMinutesInMs } from '../../shared/dates-helper';

import { TimeUsage } from '../DailyTimeUsage/DailyTimeUsage';
import { GeneralTimeline } from '../GeneralTimeline/GeneralTimeline';
import { OverallActivityCalendarPanel } from '../OverallActivityCalendar/OverallActiivtyCalendar';
import { Panel } from '../Panel/Panel';

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
      <OverallActivityCalendarPanel
        store={store}
        navigateToDateActivityPage={onNavigateToActivityPage}
      />
      {todaysUsage > MINUTE_IN_MS ? (
        <Panel>
          <TimeUsage
            time={todaysUsage}
            averageTime={weeklyUsage / 7}
            averageTimeComparedTo={'last 7 days average'}
            title={'Surfed Today'}
          ></TimeUsage>
        </Panel>
      ) : null}
      <GeneralTimeline
        title="Activity in last 6 hours"
        activityTimeline={timelineEvents}
        filteredHostname={null}
        emptyHoursMarginCount={0}
      />
    </div>
  );
};
