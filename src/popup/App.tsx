import * as React from 'react';
import { FC } from 'react';
import { DailyUsageContainer } from '../components/DailyUsage/container';

import { ActivityCalendarContainer } from '../containers/Calendar/container';
import { createGlobalSyncStorageListener } from '../shared/browser-sync-storage';

import './App.css';

const syncStorage = createGlobalSyncStorageListener();

export const PopupApp: FC<{}> = () => {
  return (
    <div className="root">
      <ActivityCalendarContainer
        storage={syncStorage}
      ></ActivityCalendarContainer>
      <DailyUsageContainer storage={syncStorage}></DailyUsageContainer>
    </div>
  );
};
