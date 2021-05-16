import * as React from 'react';
import { FC } from 'react';

import { ActivityCalendarContainer } from '../containers/Calendar/Calendar';
import { createGlobalSyncStorageListener } from '../shared/browser-sync-storage';

import './App.css';

const syncStorage = createGlobalSyncStorageListener();

export const PopupApp: FC<{}> = () => {
  const hours = true ? (
    <>
      {' '}
      <span>5</span> hours
    </>
  ) : null;

  const minutes = true ? (
    <>
      {' '}
      <span>12</span> minues
    </>
  ) : null;

  const seconds = true ? (
    <>
      {' '}
      <span>24</span> seconds
    </>
  ) : null;

  return (
    <div className="root">
      <div>
        Today you browsed web for{hours}
        {minutes}
        {seconds}
      </div>
      <ActivityCalendarContainer
        storage={syncStorage}
      ></ActivityCalendarContainer>
    </div>
  );
};
