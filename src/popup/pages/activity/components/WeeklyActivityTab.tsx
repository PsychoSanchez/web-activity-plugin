import * as React from 'react';

import { i18n } from '@shared/services/i18n';
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

const ACTIVITY_ON_ALL_WEBSITES = 'ALL_WEBSITES';

export const WeeklyActivityTab: React.FC<
  ActivityPageWeeklyActivityTabProps
> = ({ store, sundayDate }) => {
  const [pickedDomain, setPickedDomain] = React.useState<
    typeof ACTIVITY_ON_ALL_WEBSITES | HostName
  >(ACTIVITY_ON_ALL_WEBSITES);
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
    if (pickedDomain === ACTIVITY_ON_ALL_WEBSITES) {
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
    () =>
      i18n('ActivityPageWeeklyTab_WeeklyWebsiteActivityChartTitle', {
        domain:
          pickedDomain === ACTIVITY_ON_ALL_WEBSITES
            ? i18n('ActivityPageWeeklyTab_AllWebsites')
            : pickedDomain,
      }),
    [pickedDomain],
  );

  return (
    <div className="flex flex-col gap-2">
      <TimeUsagePanel
        title={i18n('ActivityPageWeeklyTab_TimeUsagePanelHeader')}
        totalActivityTime={weeklyActivityAverage}
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
        title={i18n('ActivityPageWeeklyTab_WebsiteActivityTableHeader')}
        onDomainRowClicked={handleDomainRowClick}
      />
    </div>
  );
};
