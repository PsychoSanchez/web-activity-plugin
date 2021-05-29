import classNames from 'classnames/bind';
import * as React from 'react';

import { GithubCalendarWrapper } from '../GithubCalendarWrapper/GithubCalendarWrapper';
import {
  TotalDailyActivity,
  CalendarDisplayedActivity,
  CalendarContainerProps,
} from '../GithubCalendarWrapper/types';

import { getActivityLevel } from './helpers';

import styles from './container.css';

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

export const OverallActivityCalendarPanel: React.FC<CalendarContainerProps> = ({
  store,
  navigateToDateActivityPage,
}) => {
  const calendarActivity = convertTotalDailyActiityToCalendarActivity(store);

  return (
    <div className={cx('calendar-panel', 'panel')}>
      <div className={cx('panel-header', 'calendar-panel-header')}>
        Overall Calendar Activity
      </div>
      <div className={cx('calendar-panel-body', 'panel-body')}>
        <GithubCalendarWrapper
          activity={calendarActivity}
          onDateClick={navigateToDateActivityPage}
        />
      </div>
    </div>
  );
};
