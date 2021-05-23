import classNames from 'classnames/bind';
import * as React from 'react';
import { browser } from 'webextension-polyfill-ts';

import { getActivityLevel } from '../../components/Calendar/helpers';
import {
  CalendarDisplayedActivity,
  TotalDailyActivity,
} from '../../components/Calendar/types';
import { ActivityCalendar } from './component';
import styles from './container.css';
import { CalendarContainerProps } from './types';

const cx = classNames.bind(styles);

const convertTotalDailyActiityToCalendarActivity = (
  totalActivity: TotalDailyActivity = {}
): CalendarDisplayedActivity => {
  const calendarActivity: CalendarDisplayedActivity = {};

  return Object.keys(totalActivity)
    .filter((key) => key.indexOf('-') === 4)
    .reduce((acc, key) => {
      const totalTimeSpentThatDay = Object.values(totalActivity[key]).reduce(
        (acc, val) => acc + val,
        0
      );
      acc[key] = getActivityLevel(totalTimeSpentThatDay);

      return acc;
    }, calendarActivity);
};

export const ActivityCalendarContainer: React.FC<CalendarContainerProps> = ({
  store,
}) => {
  const calendarActivity = React.useMemo(
    () => convertTotalDailyActiityToCalendarActivity(store),
    []
  );

  return (
    <div className={cx('calendar-panel', 'panel')}>
      <div className={cx('panel-header', 'calendar-panel-header')}>
        Overall Calendar Activity
      </div>
      <div className={cx('calendar-panel-body', 'panel-body')}>
        <ActivityCalendar activity={calendarActivity}></ActivityCalendar>
      </div>
    </div>
  );
};
