import * as React from 'react';
import './container.css';

import { TOTAL_DAILY_BROWSER_ACTIVITY } from '../../background/storage/accumulated-daily-activity';
import { getActivityLevel } from '../../components/Calendar/helpers';
import { CalendarDisplayedActivity } from '../../components/Calendar/types';

import { ActivityCalendar } from './component';
import { CalendarContainerProps } from './types';
import {
  subscribeToBackgroundBrowserSyncStoreUpdate,
  unsubscribeFromBackgroundBrowserSyncStoreUpdate,
} from '../../shared/background-browser-sync-storage';

const convertTotalDailyActiityToCalendarActivity = (
  totalActivity: Record<string, number> = {}
): CalendarDisplayedActivity => {
  const calendarActivity: CalendarDisplayedActivity = {};

  return Object.keys(totalActivity).reduce((acc, key) => {
    acc[key] = getActivityLevel(totalActivity[key]);

    return acc;
  }, calendarActivity);
};

export const ActivityCalendarContainer: React.FC<CalendarContainerProps> =
  () => {
    const [isLoading, setIsLoading] = React.useState(true);
    const [calendarActivity, setCalendarActivity] =
      React.useState<CalendarDisplayedActivity>({});

    React.useEffect(() => {
      const listener = (activity: Record<string, Record<string, number>>) => {
        const totalBrowserActivity = activity[TOTAL_DAILY_BROWSER_ACTIVITY];
        setCalendarActivity(
          convertTotalDailyActiityToCalendarActivity(totalBrowserActivity)
        );

        setIsLoading(false);
      };

      subscribeToBackgroundBrowserSyncStoreUpdate(listener);

      return () => {
        unsubscribeFromBackgroundBrowserSyncStoreUpdate(listener);
      };
    }, []);

    return (
      <div className="calendar-panel">
        <div className="panel-header calendar-panel-header">Activity</div>
        <div className="calendar-panel-body">
          {isLoading ? (
            <div className="calendar-panel-preloader">
              Loading your activity
            </div>
          ) : (
            <ActivityCalendar activity={calendarActivity}></ActivityCalendar>
          )}
        </div>
      </div>
    );
  };
