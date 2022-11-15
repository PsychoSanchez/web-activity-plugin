import { DBSchema, openDB } from 'idb';

import { ActiveTabState, LogMessage, TimeStore, TimelineRecord } from './types';

export enum Database {
  TimeTrackerStore = 'btt-store',
}

export enum TimeTrackerStoreTables {
  Timeline = 'timeline',
  State = 'state',
  Logs = 'logs',
}

export enum TimeTrackerStoreStateTableKeys {
  ActiveTab = 'active-tab',
  AppState = 'app-state',
  OverallState = 'overall-state',
}

export const DB_VERSION = 1;

export interface TimelineDatabase extends DBSchema {
  [TimeTrackerStoreTables.Timeline]: {
    value: TimelineRecord;
    key: string;
    indexes: {
      date: string;
      hostname: string;
    };
  };
  [TimeTrackerStoreTables.Logs]: {
    value: LogMessage;
    key: string;
  };
  [TimeTrackerStoreTables.State]: {
    value: ActiveTabState | TimelineRecord | TimeStore | null;
    key: string;
  };
}

export const connect = () =>
  openDB<TimelineDatabase>(Database.TimeTrackerStore, DB_VERSION, {
    upgrade(db) {
      const tabsStateStore = db.createObjectStore(TimeTrackerStoreTables.State);
      tabsStateStore.put(null, TimeTrackerStoreStateTableKeys.ActiveTab);
      tabsStateStore.put(
        {
          activeTabs: [],
          focusedActiveTab: null,
          focusedWindowId: undefined,
          idleState: undefined,
        },
        TimeTrackerStoreStateTableKeys.AppState
      );

      const store = db.createObjectStore(TimeTrackerStoreTables.Timeline, {
        // The 'id' property of the object will be the key.
        keyPath: 'id',
        // If it isn't explicitly set, create a value by auto incrementing.
        autoIncrement: true,
      });

      store.createIndex('date', 'date', { unique: false });
      store.createIndex('hostname', 'hostname', { unique: false });

      db.createObjectStore(TimeTrackerStoreTables.Logs, {
        keyPath: 'id',
        autoIncrement: true,
      });
    },
  });
