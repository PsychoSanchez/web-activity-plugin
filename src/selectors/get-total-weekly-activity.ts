import { AppStore } from '../popup/hooks/useTimeStore';
import { get7DaysPriorDate } from '../shared/dates-helper';

import { getTotalDailyActivity } from './get-total-daily-activity';

export const getTotalWeeklyActivity = (
  store: AppStore,
  weekEndDate: Date = new Date()
) =>
  get7DaysPriorDate(weekEndDate).reduce((sum, date) => {
    return sum + getTotalDailyActivity(store, date);
  }, 0);
