import { getHoursInMs, getMinutesInMs } from '../../shared/dates-helper';
import { CalendarDisplayedActivityType } from './types';

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
