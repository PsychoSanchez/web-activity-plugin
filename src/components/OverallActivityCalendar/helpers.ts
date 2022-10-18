import { getHoursInMs, getMinutesInMs } from '../../shared/dates-helper';

import {
  CalendarDisplayedActivity,
  CalendarDisplayedActivityType,
  TotalDailyActivity,
} from '../GithubCalendarWrapper/types';

export const getActivityLevel = (
  timeInMs: number
): CalendarDisplayedActivityType => {
  if (timeInMs < getMinutesInMs(1)) {
    return CalendarDisplayedActivityType.Inactive;
  }

  if (timeInMs < getHoursInMs(2.5)) {
    return CalendarDisplayedActivityType.Low;
  }

  if (timeInMs < getHoursInMs(7)) {
    return CalendarDisplayedActivityType.Medium;
  }

  return CalendarDisplayedActivityType.High;
};

export const convertCombinedDailyActivityToCalendarActivity = (
  totalActivity: Record<string, number> = {}
): CalendarDisplayedActivity => {
  const calendarActivity: CalendarDisplayedActivity = {};

  return Object.keys(totalActivity).reduce((acc, key) => {
    acc[key] = getActivityLevel(totalActivity[key]);

    return acc;
  }, calendarActivity);
};

export const getCombinedTotalDailyActivity = (
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
