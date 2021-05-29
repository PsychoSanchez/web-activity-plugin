import classNames from 'classnames/bind';
import * as React from 'react';

import { getTimeWithoutSeconds } from '../../shared/dates-helper';

import { GithubCalendarWrapper } from '../GithubCalendarWrapper/GithubCalendarWrapper';
import {
  TotalDailyActivity,
  CalendarDisplayedActivity,
  CalendarContainerProps,
} from '../GithubCalendarWrapper/types';

import { getActivityLevel } from './helpers';

import styles from './styles.css';

const cx = classNames.bind(styles);

const convertCombinedDailyActiityToCalendarActivity = (
  totalActivity: Record<string, number> = {}
): CalendarDisplayedActivity => {
  const calendarActivity: CalendarDisplayedActivity = {};

  return Object.keys(totalActivity).reduce((acc, key) => {
    acc[key] = getActivityLevel(totalActivity[key]);

    return acc;
  }, calendarActivity);
};

const getCombinedTotalDailyActivity = (
  totalActivity: TotalDailyActivity = {}
) => {
  return Object.keys(totalActivity)
    .filter((key) => key.indexOf('-') === 4)
    .reduce((acc, key) => {
      const totalTimeSpentThatDay = Object.values(totalActivity[key]).reduce(
        (acc, val) => acc + val,
        0
      );

      acc[key] = totalTimeSpentThatDay;

      return acc;
    }, {} as Record<string, number>);
};

export const OverallActivityCalendarPanel: React.FC<CalendarContainerProps> = ({
  store,
  navigateToDateActivityPage,
}) => {
  const totalDailyActivity = getCombinedTotalDailyActivity(store);
  const calendarActivity =
    convertCombinedDailyActiityToCalendarActivity(totalDailyActivity);

  const getTooltipForDateButton = React.useCallback(
    (isoDate) => {
      if (isoDate in totalDailyActivity) {
        return `${isoDate} ${getTimeWithoutSeconds(
          totalDailyActivity[isoDate]
        )}`;
      }

      return isoDate;
    },
    [totalDailyActivity]
  );

  return (
    <div className={cx('calendar-panel', 'panel')}>
      <div className={cx('panel-header', 'calendar-panel-header')}>
        Overall Activity Map
      </div>
      <div className={cx('calendar-panel-body', 'panel-body')}>
        <GithubCalendarWrapper
          activity={calendarActivity}
          onDateClick={navigateToDateActivityPage}
          getTooltip={getTooltipForDateButton}
        />
      </div>
    </div>
  );
};
