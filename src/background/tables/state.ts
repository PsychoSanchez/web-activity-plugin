import {
  connect,
  ActiveTabState,
  TimelineDatabase,
  ACTIVE_TAB_STATE_KEY,
  APP_STATE_KEY,
  TABS_STATE_TABLE,
  TimelineRecord,
} from './idb';

export async function setActiveTabRecord(
  val: TimelineDatabase['active-tab']['value']
) {
  const db = await connect();

  await db.put(TABS_STATE_TABLE, val, ACTIVE_TAB_STATE_KEY);
}

export async function getActiveTabRecord() {
  const db = await connect();
  return await db.get(TABS_STATE_TABLE, ACTIVE_TAB_STATE_KEY) as TimelineRecord | null;
}

export async function getTabsState() {
  const db = await connect();

  return await db.get(TABS_STATE_TABLE, APP_STATE_KEY) as ActiveTabState;
}

export async function setTabsState(val: ActiveTabState) {
  const db = await connect();

  await db.put(TABS_STATE_TABLE, val, APP_STATE_KEY);
}

export async function createTabsStateTransaction() {
  const db = await connect();

  return db.transaction(TABS_STATE_TABLE, 'readwrite');
}
