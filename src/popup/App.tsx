import * as React from 'react';
import { FC } from 'react';
import { DailyUsageContainer } from '../components/DailyUsage/container';

import { ActivityCalendarContainer } from '../components/Calendar/container';
import './App.css';

export const PopupApp: FC<{}> = () => {
  return (
    <div className="root">
      <ActivityCalendarContainer></ActivityCalendarContainer>
      <DailyUsageContainer></DailyUsageContainer>
    </div>
  );
};
