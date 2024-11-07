import * as React from 'react';

import { i18n } from '@shared/services/i18n';
import { getMinutesInMs } from '@shared/utils/date';

import { ActivityTimeline } from '../components/GeneralTimeline';
import { TimeUsagePanel } from '../components/TimeUsagePanel';
import { usePopupContext } from '../hooks/PopupContext';
import { useActiveTabTime } from '../hooks/useActiveTabTime';
import { useLastSixHoursTimelineEvents } from '../hooks/useLastSixHoursTimeline';
import { useIsDarkMode } from '../hooks/useTheme';
import { useTotalWebsiteActivity } from '../hooks/useTotalWebsiteActivity';
import { OverallActivityCalendar } from './overall/OverallActivityCalendar';

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
    <div>
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
      <ActivityTimeline
        title={i18n('OverallPage_ActivityTimelineInLast6Hours')}
        activityTimeline={timelineEvents}
        emptyHoursMarginCount={0}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};
