import * as React from 'react';

import { Icon, IconType } from '@shared/blocks/Icon';
import { Panel, PanelHeader } from '@shared/blocks/Panel';
import { ActivityDoughnutChart } from '@shared/components/ActivityDoughnutChart';
import { TimelineRecord } from '@shared/db/types';
import { i18n } from '@shared/services/i18n';
import { getActivityTimeline } from '@shared/tables/activity-timeline';
import { IsoDate } from '@shared/types';
import { getMinutesInMs } from '@shared/utils/date';
import { getTotalDailyActivity } from '@shared/utils/time-store';

import { ActivityTimelineChart } from '@popup/components/ActivityTimelineChart';
import { TimeUsagePanel } from '@popup/components/TimeUsagePanel';
import { useIsDarkMode } from '@popup/hooks/useTheme';
import { TimeStore } from '@popup/hooks/useTimeStore';
import { useTotalWebsiteActivity } from '@popup/hooks/useTotalWebsiteActivity';
import { WebsiteActivityTable } from '@popup/pages/activity/components/WebsiteActivityTable';

const MINUTE_IN_MS = getMinutesInMs(1);

export interface DailyActivityTabProps {
  store: TimeStore;
  date: IsoDate;
}

const useActivityTimeline = (date: IsoDate, filteredHostname?: string) => {
  const [activityTimeline, setActivityTimeline] = React.useState<
    TimelineRecord[]
  >([]);

  React.useEffect(() => {
    getActivityTimeline(date).then((timeline) => {
      setActivityTimeline(
        filteredHostname
          ? timeline.filter((record) => record.hostname === filteredHostname)
          : timeline,
      );
    });
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
  const activityByDate = React.useMemo(() => store[date] ?? {}, [store, date]);
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

  const isDarkMode = useIsDarkMode();

  const activityTimelineHeader = filteredHostname
    ? i18n('ActivityPageDailyActivityTab_ActivityTimelineHeaderOnHostname', {
        hostname: filteredHostname,
      })
    : i18n('ActivityPageDailyActivityTab_ActivityTimelineHeader');

  return (
    <>
      <TimeUsagePanel
        title={i18n('ActivityPageDailyActivityTab_TimeUsagePanelHeader')}
        totalActivityTime={totalDailyActivity}
        averageTime={weeklyUsage / 7}
      />
      <Panel className="min-h-[160px] flex flex-col justify-center">
        <PanelHeader>
          <Icon type={IconType.ChartPieAlt} />
          {i18n('ActivityPageDailyActivityTab_TopFiveActiveWebsites', { date })}
        </PanelHeader>
        {totalDailyActivity > MINUTE_IN_MS ? (
          <div className="[&>canvas]:max-h-[150px]">
            <ActivityDoughnutChart
              datasetLabel={date}
              activity={activityByDate}
              isDarkMode={isDarkMode}
            />
          </div>
        ) : (
          <div className="text-center text-neutral-800">
            {i18n('ActivityPageDailyActivityTab_EmptyActivity')}
          </div>
        )}
      </Panel>
      <div ref={scrollToRef}>
        <ActivityTimelineChart
          title={activityTimelineHeader}
          activityTimeline={activityTimeline}
          isDarkMode={isDarkMode}
        />
      </div>
      <WebsiteActivityTable
        title={i18n('ActivityPageDailyActivityTab_WebsiteActivityTableHeader')}
        websiteTimeMap={activityByDate}
        onDomainRowClicked={handleDomainRowClick}
      />
    </>
  );
};
