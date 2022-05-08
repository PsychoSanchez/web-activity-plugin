import * as React from 'react';

import {
  getActivityTimeline,
  TimelineRecord,
} from '../../background/storage/timelines';
import { useTotalWebsiteActivity } from '../../hooks/useTotalWebsiteActivity';
import { getTotalDailyActivity } from '../../selectors/get-total-daily-activity';

import { ActivityTable } from '../ActivityTable/ActivityTable';
import { DailyUsage } from '../DailyUsage/component';
import { GeneralTimeline } from '../GeneralTimeline/GeneralTimeline';

import { DailyActivityTabProps } from './types';

export const DailyActivityTab: React.FC<DailyActivityTabProps> = ({
  store,
  date,
}) => {
  const [dailyActiveWebsites, setDailyActivity] = React.useState<
    Record<string, number>
  >({});
  const [activityTimeline, setActivityTimeline] = React.useState<
    TimelineRecord[]
  >([]);
  const [filteredHostname, setFilteredHostname] =
    React.useState<string | null>(null);
  const scrollToRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    setFilteredHostname(null);
    setDailyActivity(store[date] || {});
  }, [store, date]);

  React.useEffect(() => {
    (async () => {
      const activityTimeline = await getActivityTimeline(date);
      setActivityTimeline(
        filteredHostname
          ? activityTimeline.filter(
              (record) => record.hostname === filteredHostname
            )
          : activityTimeline
      );
    })();
  }, [date, filteredHostname]);

  const { weeklyUsage } = useTotalWebsiteActivity(store);
  const totalDailyActivity = React.useMemo(
    () => getTotalDailyActivity(store, new Date(date)),
    [store, date]
  );

  const handleDomainRowClick = React.useCallback((domain: string) => {
    setFilteredHostname(domain);
    scrollToRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <>
      <DailyUsage
        date={date}
        dailyActivity={dailyActiveWebsites}
        totalDailyActivity={totalDailyActivity}
        weeklyAverage={weeklyUsage / 7}
      />
      <div ref={scrollToRef}>
        <GeneralTimeline
          title="Activity Timeline"
          key="General Timeline"
          activityTimeline={activityTimeline}
          filteredHostname={filteredHostname}
        />
      </div>
      <ActivityTable
        key="Activity Table"
        activity={dailyActiveWebsites}
        onDomainRowClicked={handleDomainRowClick}
      />
    </>
  );
};
