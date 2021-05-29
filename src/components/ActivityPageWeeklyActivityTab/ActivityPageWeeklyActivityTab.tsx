import * as React from 'react';

import { getIsoDate } from '../../shared/dates-helper';

import { ActivityTable } from '../ActivityTable/ActivityTable';
import { WeeklyWebsiteActivityChart } from '../WeeklyWebsiteActivityChart/WeeklyWebsiteActivityChart';

import { ActivityPageWeeklyActivityTabProps } from './types';

export const ActivityPageWeeklyActivityTab: React.FC<ActivityPageWeeklyActivityTabProps> =
  ({ store, weekEndDate }) => {
    const endDate = new Date(weekEndDate);

    const activity = new Array(7).fill(0).reduce((acc, _, index) => {
      endDate.setDate(endDate.getDate() - Number(index > 0));
      const dailyUsage = store[getIsoDate(endDate)] || {};
      Object.entries(dailyUsage).forEach(([key, value]) => {
        acc[key] = (acc[key] || 0) + value;
      });

      return acc;
    }, {} as Record<string, number>);

    return (
      <div>
        <WeeklyWebsiteActivityChart store={store} weekEndDate={weekEndDate} />
        <ActivityTable activity={activity} title={'Websites This Week'} />
      </div>
    );
  };
