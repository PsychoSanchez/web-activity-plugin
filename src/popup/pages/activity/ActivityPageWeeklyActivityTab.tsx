import * as React from 'react';

import { HostName } from '@shared/types';
import { getTotalWeeklyActivity } from '@shared/utils/time-store';

import { TimeUsagePanel } from '@popup/components/TimeUsagePanel';
import { TimeStore } from '@popup/hooks/useTimeStore';
import {
  getTimeStoreWeekSlice,
  getTotalWebsiteActivity,
  getTimeStoreWebsiteSlice,
} from '@popup/services/time-store';

import { WebsiteActivityTable } from './WebsiteActivityTable';
import { WeeklyWebsiteActivityChart } from './WeeklyWebsiteActivityChart';

export interface ActivityPageWeeklyActivityTabProps {
  store: TimeStore;
  sundayDate: Date;
}

export const ActivityPageWeeklyActivityTab: React.FC<
  ActivityPageWeeklyActivityTabProps
> = ({ store, sundayDate }) => {
  const [pickedDomain, setPickedDomain] = React.useState<
    'All Websites' | HostName
  >('All Websites');
  const scrollToRef = React.useRef<HTMLDivElement>(null);

  const handleDomainRowClick = React.useCallback((domain: string) => {
    // TODO: check HostName
    setPickedDomain(domain as HostName);
    scrollToRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const weekActivitySlice = React.useMemo(
    () => getTimeStoreWeekSlice(store, sundayDate),
    [store, sundayDate],
  );

  const weeklyActivityByDomain = React.useMemo(() => {
    if (pickedDomain === 'All Websites') {
      return weekActivitySlice;
    }

    return getTimeStoreWebsiteSlice(weekActivitySlice, [pickedDomain]);
  }, [weekActivitySlice, pickedDomain]);

  const weeklyActivityTotal = React.useMemo(
    () => getTotalWebsiteActivity(weekActivitySlice),
    [weekActivitySlice],
  );

  const weeklyActivityAverage = React.useMemo(() => {
    return getTotalWeeklyActivity(weeklyActivityByDomain, sundayDate) / 7;
  }, [weeklyActivityByDomain, sundayDate]);

  const presentChartTitle = React.useCallback(
    () => `Activity on ${pickedDomain} per day`,
    [pickedDomain],
  );

  return (
    <div>
      <TimeUsagePanel
        title="Average Daily Activity"
        time={weeklyActivityAverage}
      />
      <div ref={scrollToRef}>
        <WeeklyWebsiteActivityChart
          store={weeklyActivityByDomain}
          sundayDate={sundayDate}
          presentChartTitle={presentChartTitle}
        />
      </div>
      <WebsiteActivityTable
        websiteTimeMap={weeklyActivityTotal}
        title={'Websites This Week'}
        onDomainRowClicked={handleDomainRowClick}
      />
    </div>
  );
};
