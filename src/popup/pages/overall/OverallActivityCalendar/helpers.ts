import { getHoursInMs, getMinutesInMs } from '@shared/utils/date';

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
): CalendarDisplayedActivity =>
  Object.fromEntries(
    Object.entries(totalActivity).map(([key, value]) => [
      key,
      getActivityLevel(value),
    ]),
  );

export const getCombinedTotalDailyActivity = (
  totalActivity: TotalDailyActivity = {},
) => {
  return Object.fromEntries(
    Object.entries(totalActivity).map(
      ([key, value]) =>
        [
          key,
          Object.values(value).reduce((acc, val) => acc + val, 0),
        ] satisfies [key: string, activitySum: number],
    ),
  );
};
