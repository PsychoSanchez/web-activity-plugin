import * as React from 'react';

import { i18n } from '@shared/services/i18n';
import { getMinutesInMs } from '@shared/utils/date';

import { ActivityTimelineChart } from '@popup/components/ActivityTimelineChart';
import { TimeUsagePanel } from '@popup/components/TimeUsagePanel';
import { usePopupContext } from '@popup/hooks/PopupContext';
import { useActiveTabTime } from '@popup/hooks/useActiveTabTime';
import { useLastSixHoursTimelineEvents } from '@popup/hooks/useLastSixHoursTimeline';
import { useIsDarkMode } from '@popup/hooks/useTheme';
import { useTotalWebsiteActivity } from '@popup/hooks/useTotalWebsiteActivity';

import { OverallActivityCalendar } from './components/OverallActivityCalendar';

export interface OverallPageProps {
  onNavigateToActivityPage: React.ComponentProps<
    typeof OverallActivityCalendar
  >['onDateClick'];
}

const MINUTE_IN_MS = getMinutesInMs(1);

export const OverallPage: React.FC<OverallPageProps> = ({
  onNavigateToActivityPage,
}) => {
  const { store, activeHostname } = usePopupContext();
  const { todaysUsage, weeklyUsage } = useTotalWebsiteActivity(store);
  const timelineEvents = useLastSixHoursTimelineEvents();
  const { time: activeWebsiteTime, weekTime: activeWebsiteWeekTime } =
    useActiveTabTime();
  const isDarkMode = useIsDarkMode();

  return (
    <div className="flex flex-col gap-2">
      {todaysUsage > MINUTE_IN_MS ? (
        <TimeUsagePanel
          title={i18n('OverallPage_TimeUsagePanelHeader')}
          totalActivityTime={todaysUsage}
          averageTime={weeklyUsage / 7}
        />
      ) : null}
      {activeWebsiteTime ? (
        <TimeUsagePanel
          title={i18n('OverallPage_TimeUsagePanelOnActiveWebsite', {
            hostname: activeHostname,
          })}
          totalActivityTime={activeWebsiteTime}
          averageTime={activeWebsiteWeekTime / 7}
        />
      ) : null}
      <OverallActivityCalendar
        store={store}
        onDateClick={onNavigateToActivityPage}
      />
      <ActivityTimelineChart
        title={i18n('OverallPage_ActivityTimelineInLast6Hours')}
        activityTimeline={timelineEvents}
        emptyHoursMarginCount={0}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};
