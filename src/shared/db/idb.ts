import { DBSchema, openDB } from 'idb';

import {
  ActiveTabState,
  LogMessage,
  TimeStore,
  TimelineRecord,
  DomainInfo,
} from './types';

export enum Database {
  TimeTrackerStore = 'btt-store',
}

export enum TimeTrackerStoreTables {
  Timeline = 'timeline',
  State = 'state',
  Logs = 'logs',
  DomainInfo = 'domain-info',
}

export enum TimeTrackerStoreStateTableKeys {
  ActiveTab = 'active-tab',
  AppState = 'app-state',
  OverallState = 'overall-state',
}

export const DB_VERSION = 3;

export interface TimelineDatabase extends DBSchema {
  [TimeTrackerStoreTables.Timeline]: {
    value: TimelineRecord;
    key: string;
    indexes: {
      date: string;
      hostname: string;
      recordId: number;
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
  [TimeTrackerStoreTables.DomainInfo]: {
    value: DomainInfo;
    key: string;
    indexes: {
      hostname: string;
    };
  };
}

export const connect = () =>
  openDB<TimelineDatabase>(Database.TimeTrackerStore, DB_VERSION, {
    async upgrade(db, oldVersion, newVersion, transaction) {
      if (oldVersion < 1) {
        const tabsStateStore = db.createObjectStore(
          TimeTrackerStoreTables.State,
        );
        tabsStateStore.put(null, TimeTrackerStoreStateTableKeys.ActiveTab);
        tabsStateStore.put(
          {
            activeTabs: [],
            focusedActiveTab: null,
            focusedWindowId: undefined,
            idleState: undefined,
          },
          TimeTrackerStoreStateTableKeys.AppState,
        );

        const timelineStore = db.createObjectStore(
          TimeTrackerStoreTables.Timeline,
          {
            // The 'id' property of the object will be the key.
            keyPath: 'id',
            // If it isn't explicitly set, create a value by auto incrementing.
            autoIncrement: true,
          },
        );

        timelineStore.createIndex('date', 'date', { unique: false });
        timelineStore.createIndex('hostname', 'hostname', { unique: false });

        db.createObjectStore(TimeTrackerStoreTables.Logs, {
          keyPath: 'id',
          autoIncrement: true,
        });
      }

      // Activity period start is a unique id for each record if there is a race condition
      if (oldVersion < 2) {
        const timeline = transaction.objectStore(
          TimeTrackerStoreTables.Timeline,
        );

        timeline.createIndex('recordId', 'activityPeriodStart', {
          unique: true,
        });
      }

      if (oldVersion < 3) {
        const domainInfoStore = db.createObjectStore(
          TimeTrackerStoreTables.DomainInfo,
          {
            keyPath: 'hostname',
          },
        );

        domainInfoStore.createIndex('hostname', 'hostname', { unique: true });
      }
    },
  });
