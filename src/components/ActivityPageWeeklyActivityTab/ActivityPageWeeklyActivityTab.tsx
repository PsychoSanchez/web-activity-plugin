import * as React from 'react';

import { get7DaysPriorDate, getIsoDate } from '../../shared/dates-helper';

import { ActivityTable } from '../ActivityTable/ActivityTable';
import { WeeklyWebsiteActivityChart } from '../WeeklyWebsiteActivityChart/WeeklyWebsiteActivityChart';

import { ActivityPageWeeklyActivityTabProps } from './types';

export const ActivityPageWeeklyActivityTab: React.FC<ActivityPageWeeklyActivityTabProps> =
  ({ store, sundayDate }) => {
    const activity = get7DaysPriorDate(sundayDate, (date) => {
      return store[getIsoDate(date)] || {};
    }).reduce((acc, dailyUsage) => {
      Object.entries(dailyUsage).forEach(([key, value]) => {
        acc[key] = (acc[key] || 0) + value;
      });

      return acc;
    }, {} as Record<string, number>);

    return (
      <div>
        <WeeklyWebsiteActivityChart store={store} sundayDate={sundayDate} />
        <ActivityTable activity={activity} title={'Websites This Week'} />
      </div>
    );
  };
