import * as React from 'react';

import {
  getTotalDailyActivity,
  getTotalWeeklyActivity,
} from '@shared/utils/time-store';

import { TimeStore } from './useTimeStore';

export const useTotalWebsiteActivity = (store: TimeStore) => {
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
