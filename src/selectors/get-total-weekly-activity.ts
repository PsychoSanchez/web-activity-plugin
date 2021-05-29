import { AppStore } from '../hooks/useTimeStore';

import { getTotalDailyActivity } from './get-total-daily-activity';

export const getTotalWeeklyActivity = (
  store: AppStore,
  weekEndDate: Date = new Date()
) => {
  return new Array(7).fill(0).reduce((sum, _, index) => {
    weekEndDate.setDate(weekEndDate.getDate() - Number(index > 0));

    return sum + getTotalDailyActivity(store, weekEndDate);
  }, 0);
};
