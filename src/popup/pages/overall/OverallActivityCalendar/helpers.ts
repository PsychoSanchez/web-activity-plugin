import { getHoursInMs, getMinutesInMs } from '@shared/utils/dates-helper';

import {
  CalendarDisplayedActivity,
  CalendarDisplayedActivityType,
  TotalDailyActivity,
} from '../GithubCalendarWrapper';

export const getActivityLevel = (
  timeInMs: number,
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
  totalActivity: Record<string, number> = {},
): CalendarDisplayedActivity => {
  const calendarActivity: CalendarDisplayedActivity = {};

  return Object.entries(totalActivity).reduce((acc, [key, value]) => {
    acc[key] = getActivityLevel(value);

    return acc;
  }, calendarActivity);
};

export const getCombinedTotalDailyActivity = (
  totalActivity: TotalDailyActivity = {},
) => {
  return Object.entries(totalActivity).reduce(
    (acc, [key, value]) => {
      const totalTimeSpentThatDay = Object.values(value).reduce(
        (acc, val) => acc + val,
        0,
      );

      acc[key] = totalTimeSpentThatDay;

      return acc;
    },
    {} as Record<string, number>,
  );
};
