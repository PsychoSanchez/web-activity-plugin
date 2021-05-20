import * as React from 'react';
import classNames from 'classnames/bind';
import { browser } from 'webextension-polyfill-ts';

import { getActivityLevel } from '../../components/Calendar/helpers';
import { CalendarDisplayedActivity } from '../../components/Calendar/types';

import { ActivityCalendar } from './component';
import { CalendarContainerProps } from './types';

import styles from './container.css';

const cx = classNames.bind(styles);

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
      browser.storage.local.get().then((activity: TotalDailyActivity) => {
        setCalendarActivity(
          convertTotalDailyActiityToCalendarActivity(activity)
        );

        setIsLoading(false);
      });
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
