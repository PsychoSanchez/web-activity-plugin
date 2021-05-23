import * as React from 'react';
import { browser } from 'webextension-polyfill-ts';

import { getIsoDate } from '../../shared/dates-helper';
import { ActivityTable } from '../ActivityTable/ActivityTable';
import { ActivityCalendarContainer } from '../Calendar/container';
import { DailyUsage } from '../DailyUsage/component';

interface ActivityPageProps {
  store: Record<string, any>;
}

export const ActivityPage: React.FC<ActivityPageProps> = ({ store }) => {
  const [date, setDate] = React.useState(getIsoDate(new Date()));
  const [dailyActiveWebsites, setDailyActivity] = React.useState<
    Record<string, number>
  >({});

  React.useEffect(() => {
    browser.storage.local.get().then((activity: Record<string, any>) => {
      setDailyActivity(activity[date] || {});
    });
  }, [date]);

  const totalDailyActivity = React.useMemo(
    () =>
      Object.values(dailyActiveWebsites).reduce((acc, val) => acc + val, 0) ||
      0,
    [dailyActiveWebsites]
  );

  return (
    <>
      <ActivityCalendarContainer store={store} />
      <DailyUsage
        date={date}
        onDateChange={setDate}
        dailyActivity={dailyActiveWebsites}
        totalDailyActivity={totalDailyActivity}
      />
      <ActivityTable activity={dailyActiveWebsites} />
    </>
  );
};
