import * as React from 'react';

import { AppStore } from '../../hooks/useTimeStore';
import { useTotalWebsiteActivity } from '../../hooks/useTotalWebsiteActivity';
import { getTotalDailyActivity } from '../../selectors/get-total-daily-activity';
import { getTotalWeeklyActivity } from '../../selectors/get-total-weekly-activity';
import { getIsoDate, getMinutesInMs } from '../../shared/dates-helper';

import { DailyTimeUsage } from '../DailyTimeUsage/DailyTimeUsage';
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
          <DailyTimeUsage
            time={todaysUsage}
            averageTime={weeklyUsage / 7}
            title={'Website Activity Today'}
          ></DailyTimeUsage>
        </Panel>
      ) : null}
      Goals Current Limits time
    </div>
  );
};
