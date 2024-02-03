import { get7DaysPriorDate } from '@shared/utils/dates-helper';

import { TimeStore } from '../hooks/useTimeStore';
import { getTotalDailyActivity } from './get-total-daily-activity';

export const getTotalWeeklyActivity = (store: TimeStore, date = new Date()) =>
  get7DaysPriorDate(date).reduce((sum, date) => {
    return sum + getTotalDailyActivity(store, date);
  }, 0);
