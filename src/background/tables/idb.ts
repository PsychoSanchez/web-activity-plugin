import { DBSchema, openDB } from 'idb';

export const DB_NAME = 'btt-store';
export const DB_VERSION = 1;
export const TIMELINE_TABLE_NAME = 'timeline';
export const TABS_STATE_TABLE = 'state';
export const ACTIVE_TAB_STATE_KEY = 'active-tab';
export const APP_STATE_KEY = 'app-state';

type Tab = chrome.tabs.Tab;
type IdleState = chrome.idle.IdleState;

export interface TimelineRecord {
  url: string;
  hostname: string;
  docTitle: string;
  favIconUrl: string | undefined;
  date: string;
  activityPeriodStart: number;
  activityPeriodEnd: number;
}

export type ActiveTabState = {
  activeTabs: Tab[];
  focusedActiveTab?: Tab | null;
  focusedWindowId?: number;
  idleState?: IdleState;
};

export interface LogMessage {
  message: string;
  timestamp: number;
}

export interface TimelineDatabase extends DBSchema {
  [TIMELINE_TABLE_NAME]: {
    value: TimelineRecord;
    key: string;
    indexes: {
      date: string;
      hostname: string;
    };
  };
  logs: {
    value: LogMessage;
    key: string;
  };
  [TABS_STATE_TABLE]: {
    value: ActiveTabState | TimelineRecord | null;
    key: string;
  };
}

export const connect = () =>
  openDB<TimelineDatabase>(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion) {
      const tabsStateStore = db.createObjectStore(TABS_STATE_TABLE);
      tabsStateStore.put(null, ACTIVE_TAB_STATE_KEY);
      tabsStateStore.put(
        {
          activeTabs: [],
          focusedActiveTab: null,
          focusedWindowId: undefined,
          idleState: undefined,
        },
        APP_STATE_KEY
      );

      const store = db.createObjectStore(TIMELINE_TABLE_NAME, {
        // The 'id' property of the object will be the key.
        keyPath: 'id',
        // If it isn't explicitly set, create a value by auto incrementing.
        autoIncrement: true,
      });

      store.createIndex('date', 'date', { unique: false });
      store.createIndex('hostname', 'hostname', { unique: false });

      db.createObjectStore('logs', {
        keyPath: 'id',
        autoIncrement: true,
      });
    },
  });
