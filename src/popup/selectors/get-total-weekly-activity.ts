import { TimeStore } from '../hooks/useTimeStore';
import { get7DaysPriorDate } from '../../shared/utils/dates-helper';

import { getTotalDailyActivity } from './get-total-daily-activity';

export const getTotalWeeklyActivity = (
  store: TimeStore,
  weekEndDate: Date = new Date()
) =>
  get7DaysPriorDate(weekEndDate).reduce((sum, date) => {
    return sum + getTotalDailyActivity(store, date);
  }, 0);
