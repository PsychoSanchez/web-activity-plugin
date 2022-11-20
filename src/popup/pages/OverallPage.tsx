import * as React from 'react';

import {
  getFocusedTab,
  getTabFromFocusedWindow,
} from '../../background/browser-api/tabs';
import { getFocusedWindowId } from '../../background/browser-api/windows';
import { getIsoDate, getMinutesInMs } from '../../shared/utils/dates-helper';

import { TimeUsagePanel } from '../components/DailyTimeUsage/DailyTimeUsage';
import { GeneralTimeline } from '../components/GeneralTimeline/GeneralTimeline';
import { OverallActivityCalendarPanel } from '../components/OverallActivityCalendar/OverallActivtyCalendar';
import { useLastSixHoursTimelineEvents } from '../hooks/useLastSixHoursTimeline';
import { AppStore } from '../hooks/useTimeStore';
import { useTotalWebsiteActivity } from '../hooks/useTotalWebsiteActivity';

export interface OverallPageProps {
  store: AppStore;
  onNavigateToActivityPage: React.ComponentProps<
    typeof OverallActivityCalendarPanel
  >['navigateToDateActivityPage'];
}

const MINUTE_IN_MS = getMinutesInMs(1);

export const OverallPage: React.FC<OverallPageProps> = ({
  store,
  onNavigateToActivityPage,
}) => {
  const { todaysUsage, weeklyUsage } = useTotalWebsiteActivity(store);
  const timelineEvents = useLastSixHoursTimelineEvents();
  const [activeHostUsage, setActiveHostUsage] =
    React.useState<number | null>(null);
  const [activeHost, setActiveHost] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function getActiveHostInfo() {
      const tab = await getFocusedTab();

      if (tab?.url) {
        const today = getIsoDate(new Date());
        const host = new URL(tab.url).host;
        const usage = store[today]?.[host] ?? null;

        setActiveHost(host);
        setActiveHostUsage(usage);
      }
    }

    getActiveHostInfo();
  }, [store]);

  return (
    <div>
      {todaysUsage > MINUTE_IN_MS ? (
        <TimeUsagePanel
          title="Surfed Today"
          time={todaysUsage}
          averageTime={weeklyUsage / 7}
          averageTimeComparedTo="last 7 days average"
        />
      ) : null}
      {activeHostUsage ? (
        <TimeUsagePanel
          title={`Surfed on ${activeHost}`}
          time={activeHostUsage}
          averageTime={weeklyUsage / 7}
          averageTimeComparedTo="last 7 days average"
        />
      ) : null}
      <OverallActivityCalendarPanel
        store={store}
        navigateToDateActivityPage={onNavigateToActivityPage}
      />
      <GeneralTimeline
        title="Activity in last 6 hours"
        activityTimeline={timelineEvents}
        filteredHostname={null}
        emptyHoursMarginCount={0}
      />
    </div>
  );
};
