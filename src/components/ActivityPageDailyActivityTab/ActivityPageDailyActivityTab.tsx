import * as React from 'react';

import { useTotalWebsiteActivity } from '../../hooks/useTotalWebsiteActivity';
import { getTotalDailyActivity } from '../../selectors/get-total-daily-activity';

import { ActivityTable } from '../ActivityTable/ActivityTable';
import { DailyUsage } from '../DailyUsage/component';
import { DailyWebsitesActivityIntervals } from '../DailyWebsitesActivityIntervals/DailyWebsitesActivityIntervals';
import { Panel } from '../Panel/Panel';

import { DailyActivityTabProps } from './types';

export const DailyActivityTab: React.FC<DailyActivityTabProps> = ({
  store,
  date,
}) => {
  const [dailyActiveWebsites, setDailyActivity] = React.useState<
    Record<string, number>
  >({});

  React.useEffect(() => {
    setDailyActivity(store[date] || {});
  }, [store, date]);

  const { weeklyUsage } = useTotalWebsiteActivity(store);

  const totalDailyActivity = getTotalDailyActivity(store, new Date(date));

  return (
    <>
      <DailyUsage
        date={date}
        dailyActivity={dailyActiveWebsites}
        totalDailyActivity={totalDailyActivity}
        weeklyAverage={weeklyUsage / 7}
      />
      <Panel header={<span>Activity periods</span>}>
        <DailyWebsitesActivityIntervals />
      </Panel>
      <ActivityTable activity={dailyActiveWebsites} />
    </>
  );
};
