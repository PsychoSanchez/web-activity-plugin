import * as React from 'react';

import { getTotalDailyActivity } from '../../selectors/get-total-daily-activity';
import { getTotalWeeklyActivity } from '../../selectors/get-total-weekly-activity';

import { AppStore } from './useTimeStore';

export const useTotalWebsiteActivity = (store: AppStore) => {
  const activity = React.useMemo(() => {
    const today = new Date();
    const todaysUsage = getTotalDailyActivity(store, today);
    const weeklyUsage = getTotalWeeklyActivity(store, today);

    return {
      todaysUsage,
      weeklyUsage,
    };
  }, [store]);

  return activity;
};
