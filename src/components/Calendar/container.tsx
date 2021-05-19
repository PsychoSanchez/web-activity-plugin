import * as React from 'react';
import classNames from 'classnames/bind';

import styles from './container.css';

const cx = classNames.bind(styles);

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
  totalActivity: TotalDailyActivity = {}
): CalendarDisplayedActivity => {
  const calendarActivity: CalendarDisplayedActivity = {};

  const totalBrowserActivity = Object.keys(totalActivity)
    .filter((key) => key.indexOf('-') === 4)
    .reduce((acc, key) => {
      const totalTimeSpentThatDay = Object.values(totalActivity[key]).reduce(
        (acc, val) => acc + val,
        0
      );
      acc[key] = getActivityLevel(totalTimeSpentThatDay);

      return acc;
    }, calendarActivity);

  return totalBrowserActivity;
};

type TotalDailyActivity = Record<string, Record<string, number>>;

export const ActivityCalendarContainer: React.FC<CalendarContainerProps> =
  () => {
    const [isLoading, setIsLoading] = React.useState(true);
    const [calendarActivity, setCalendarActivity] =
      React.useState<CalendarDisplayedActivity>({});

    React.useEffect(() => {
      const listener = (activity: TotalDailyActivity) => {
        setCalendarActivity(
          convertTotalDailyActiityToCalendarActivity(activity)
        );

        setIsLoading(false);
      };

      subscribeToBackgroundBrowserSyncStoreUpdate(listener);

      return () => {
        unsubscribeFromBackgroundBrowserSyncStoreUpdate(listener);
      };
    }, []);

    return (
      <div className={cx('calendar-panel')}>
        <div className={cx('panel-header', 'calendar-panel-header')}>
          Activity
        </div>
        <div className={cx('calendar-panel-body')}>
          {isLoading ? (
            <div className={cx('calendar-panel-preloader')}>
              Loading your activity
            </div>
          ) : (
            <ActivityCalendar activity={calendarActivity}></ActivityCalendar>
          )}
        </div>
      </div>
    );
  };
