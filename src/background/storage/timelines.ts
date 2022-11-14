import { DBSchema, openDB } from 'idb';

const DB_NAME = 'surfing-timeline-store';
const DB_VERSION = 4;
const TIMELINE_TABLE_NAME = 'timeline';
const ACTIVE_TAB_TABLE = 'activity';
const TABS_STATE_TABLE = 'tabstate';

export interface TimelineRecord {
  url: string;
  hostname: string;
  docTitle: string;
  favIconUrl: string | undefined;
  date: string;
  activityPeriodStart: number;
  activityPeriodEnd: number;
}

type Tab = chrome.tabs.Tab;
type IdleState = chrome.idle.IdleState;

export type ActiveTabState = {
  activeTabs: Tab[];
  focusedActiveTab?: Tab | null;
  focusedWindowId?: number;
  idleState?: IdleState;
};

export interface TimelineDatabase extends DBSchema {
  [TIMELINE_TABLE_NAME]: {
    value: TimelineRecord;
    key: string;
    indexes: {
      date: string;
      hostname: string;
    };
  };
  [ACTIVE_TAB_TABLE]: {
    value: TimelineRecord | null;
    key: string;
  };
  logs: {
    value: { message: string; timestamp: number };
    key: string;
  };
  [TABS_STATE_TABLE]: {
    value: ActiveTabState;
    key: string;
  };
}

const getDb = () =>
  openDB<TimelineDatabase>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      db.createObjectStore(ACTIVE_TAB_TABLE).put(null, ACTIVE_TAB_TABLE);
      db.createObjectStore(TABS_STATE_TABLE).put(
        {
          activeTabs: [],
          focusedActiveTab: null,
          focusedWindowId: undefined,
          idleState: undefined,
        },
        TABS_STATE_TABLE
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

export async function getActivityTimeline(isoDate: string) {
  const db = await getDb();

  return db.getAllFromIndex(TIMELINE_TABLE_NAME, 'date', isoDate);
}

export async function saveActivityTimelineRecord(
  val: TimelineDatabase['timeline']['value']
) {
  const db = await getDb();
  await db.add(TIMELINE_TABLE_NAME, val);
}

export async function setActiveTabRecord(
  val: TimelineDatabase['active-tab']['value']
) {
  const db = await getDb();

  await db.put(ACTIVE_TAB_TABLE, val, ACTIVE_TAB_TABLE);
}

export async function getActiveTabRecord() {
  const db = await getDb();
  return await db.get(ACTIVE_TAB_TABLE, ACTIVE_TAB_TABLE);
}

export async function logMessage(message: string) {
  const db = await getDb();

  await db.add('logs', { message, timestamp: Date.now() });
}

export async function getTabsState() {
  const db = await getDb();

  return await db.get(TABS_STATE_TABLE, TABS_STATE_TABLE);
}

export async function setTabsState(val: ActiveTabState) {
  const db = await getDb();

  await db.put(TABS_STATE_TABLE, val, TABS_STATE_TABLE);
}

export async function createTabsStateTransaction() {
  const db = await getDb();

  return db.transaction(TABS_STATE_TABLE, 'readwrite');
}
