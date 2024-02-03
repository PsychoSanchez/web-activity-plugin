import * as React from 'react';

import { get7DaysPriorDate, getIsoDate } from '@shared/utils/dates-helper';

import { TimeUsagePanel } from '../../components/TimeUsagePanel';
import { TimeStore } from '../../hooks/useTimeStore';
import { getTotalWeeklyActivity } from '../../selectors/get-total-weekly-activity';
import { WebsiteActivityTable } from './WebsiteActivityTable';
import { WeeklyWebsiteActivityChart } from './WeeklyWebsiteActivityChart';

export interface ActivityPageWeeklyActivityTabProps {
  store: TimeStore;
  sundayDate: Date;
}

export const ActivityPageWeeklyActivityTab: React.FC<
  ActivityPageWeeklyActivityTabProps
> = ({ store, sundayDate }) => {
  const [pickedDomain, setPickedDomain] = React.useState<null | string>(null);
  const scrollToRef = React.useRef<HTMLDivElement | null>(null);

  const handleDomainRowClick = React.useCallback((domain: string) => {
    setPickedDomain(domain);
    scrollToRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const allWeekActivity = React.useMemo(
    () =>
      get7DaysPriorDate(sundayDate).reduce((acc, date) => {
        const isoDate = getIsoDate(date);
        acc[isoDate] = store[isoDate] || {};

        return acc;
      }, {} as TimeStore),
    [store, sundayDate],
  );

  const filteredWebsiteWeekActivity = React.useMemo(() => {
    if (pickedDomain === null) {
      return allWeekActivity;
    }

    return Object.entries(allWeekActivity).reduce(
      (acc, [date, dateWebsitesUsage]) => {
        acc[date] = {
          [pickedDomain]: dateWebsitesUsage[pickedDomain] || 0,
        };

        return acc;
      },
      {} as typeof allWeekActivity,
    );
  }, [allWeekActivity, pickedDomain]);

  const totalWebsiteWeeklyActivity = React.useMemo(
    () =>
      Object.values(allWeekActivity).reduce(
        (acc, dailyUsage) => {
          Object.entries(dailyUsage).forEach(([key, value]) => {
            acc[key] ??= 0;
            acc[key] += value;
          });

          return acc;
        },
        {} as Record<string, number>,
      ),
    [allWeekActivity],
  );

  const averageWeeklyActivity = React.useMemo(() => {
    const averageWeekly =
      getTotalWeeklyActivity(filteredWebsiteWeekActivity, sundayDate) / 7;
    return averageWeekly;
  }, [filteredWebsiteWeekActivity, sundayDate]);

  const presentedPickedDomain = pickedDomain ?? 'All Websites';

  return (
    <div>
      <TimeUsagePanel
        title="Average Daily Activity"
        time={averageWeeklyActivity}
      />
      <div ref={scrollToRef}>
        <WeeklyWebsiteActivityChart
          store={filteredWebsiteWeekActivity}
          sundayDate={sundayDate}
          presentChartTitle={() =>
            `Activity on ${presentedPickedDomain} per day`
          }
        />
      </div>
      <WebsiteActivityTable
        websiteTimeMap={totalWebsiteWeeklyActivity}
        title={'Websites This Week'}
        onDomainRowClicked={handleDomainRowClick}
      />
    </div>
  );
};
