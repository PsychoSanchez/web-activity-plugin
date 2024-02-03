import * as React from 'react';

import { TimelineRecord } from '@shared/db/types';
import { getActivityTimeline } from '@shared/tables/activity-timeline';

import { GeneralTimeline } from '../../components/GeneralTimeline';
import { TimeStore } from '../../hooks/useTimeStore';
import { useTotalWebsiteActivity } from '../../hooks/useTotalWebsiteActivity';
import { getTotalDailyActivity } from '../../selectors/get-total-daily-activity';
import { DailyUsage } from './DailyUsage';
import { WebsiteActivityTable } from './WebsiteActivityTable';

export interface DailyActivityTabProps {
  store: TimeStore;
  date: string;
}

const useActivityTimeline = (date: string, filteredHostname?: string) => {
  const [activityTimeline, setActivityTimeline] = React.useState<
    TimelineRecord[]
  >([]);

  React.useEffect(() => {
    (async () => {
      const timeline = await getActivityTimeline(date);
      setActivityTimeline(
        filteredHostname
          ? timeline.filter((record) => record.hostname === filteredHostname)
          : timeline,
      );
    })();
  }, [date, filteredHostname]);

  return activityTimeline;
};

export const DailyActivityTab: React.FC<DailyActivityTabProps> = ({
  store,
  date,
}) => {
  const [filteredHostname, setFilteredHostname] = React.useState<
    string | undefined
  >(undefined);
  const dailyActiveWebsites = React.useMemo(
    () => store[date] ?? {},
    [store, date],
  );
  const totalDailyActivity = React.useMemo(
    () => getTotalDailyActivity(store, new Date(date)),
    [store, date],
  );
  const { weeklyUsage } = useTotalWebsiteActivity(store);
  const activityTimeline = useActivityTimeline(date, filteredHostname);

  const scrollToRef = React.useRef<HTMLDivElement | null>(null);

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
          activityTimeline={activityTimeline}
          filteredHostname={filteredHostname}
        />
      </div>
      <WebsiteActivityTable
        websiteTimeMap={dailyActiveWebsites}
        onDomainRowClicked={handleDomainRowClick}
      />
    </>
  );
};
