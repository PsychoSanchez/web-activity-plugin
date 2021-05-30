import * as React from 'react';

import { useTotalWebsiteActivity } from '../../hooks/useTotalWebsiteActivity';
import { getMinutesInMs } from '../../shared/dates-helper';

import { TimeUsage } from '../DailyTimeUsage/DailyTimeUsage';
import { OverallActivityCalendarPanel } from '../OverallActivityCalendar/OverallActiivtyCalendar';
import { Panel } from '../Panel/Panel';

import { OverallPageProps } from './types';

const MINUTE_IN_MS = getMinutesInMs(1);

export const OverallPage: React.FC<OverallPageProps> = ({
  store,
  onNavigateToActivityPage,
}) => {
  const { todaysUsage, weeklyUsage } = useTotalWebsiteActivity(store);

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
      Goals Current Limits time
    </div>
  );
};
