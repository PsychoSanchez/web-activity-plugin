import * as React from 'react';

import { getHoursInMs, getIsoDate } from '../../shared/dates-helper';

import { ActivityDatePicker } from '../ActivityDatePicker/component';
import { ActivityTable } from '../ActivityTable/ActivityTable';
import { DailyUsage } from '../DailyUsage/component';

interface ActivityPageProps {
  store: Record<string, any>;
}

const getWeeklyAverage = (activityStore: Record<string, any>) => {
  const today = Date.now();
  const totalFor7Days = new Array(7)
    .fill(0)
    .map((_, index) => {
      return getIsoDate(new Date(today - getHoursInMs(24) * (index + 1)));
    })
    .map((date) => {
      const dateRecord = activityStore[date];

      if (!dateRecord) {
        return 0;
      }

      return Object.values(dateRecord as Record<string, number>).reduce(
        (sum, val) => sum + val,
        0
      );
    })
    .reduce((sum, dailyTotal) => sum + dailyTotal, 0);

  return totalFor7Days / 7;
};

export const ActivityPage: React.FC<ActivityPageProps> = ({ store }) => {
  const [date, setDate] = React.useState(getIsoDate(new Date()));
  const [dailyActiveWebsites, setDailyActivity] = React.useState<
    Record<string, number>
  >({});

  React.useEffect(() => {
    setDailyActivity(store[date] || {});
  }, [store, date]);

  const totalDailyActivity = React.useMemo(
    () =>
      Object.values(dailyActiveWebsites).reduce((acc, val) => acc + val, 0) ||
      0,
    [dailyActiveWebsites]
  );

  const weeklyAverage = getWeeklyAverage(store);

  return (
    <>
      <ActivityDatePicker date={date} onChange={setDate} />
      <DailyUsage
        date={date}
        onDateChange={setDate}
        dailyActivity={dailyActiveWebsites}
        totalDailyActivity={totalDailyActivity}
        weeklyAverage={weeklyAverage}
      />
      <ActivityTable activity={dailyActiveWebsites} />
    </>
  );
};
