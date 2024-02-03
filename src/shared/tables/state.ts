import {
  connect,
  TimeTrackerStoreStateTableKeys,
  TimeTrackerStoreTables,
} from '../db/idb';
import { ActiveTabState, TimelineRecord } from '../db/types';

export async function setActiveTabRecord(val: TimelineRecord | null) {
  const db = await connect();

  await db.put(
    TimeTrackerStoreTables.State,
    val,
    TimeTrackerStoreStateTableKeys.ActiveTab,
  );
}

export async function getActiveTabRecord() {
  const db = await connect();
  return (await db.get(
    TimeTrackerStoreTables.State,
    TimeTrackerStoreStateTableKeys.ActiveTab,
  )) as TimelineRecord | null;
}

export async function getTabsState() {
  const db = await connect();

  return (await db.get(
    TimeTrackerStoreTables.State,
    TimeTrackerStoreStateTableKeys.AppState,
  )) as ActiveTabState;
}

export async function setTabsState(val: ActiveTabState) {
  const db = await connect();

  await db.put(
    TimeTrackerStoreTables.State,
    val,
    TimeTrackerStoreStateTableKeys.AppState,
  );
}

export async function createTabsStateTransaction() {
  const db = await connect();

  return db.transaction(TimeTrackerStoreTables.State, 'readwrite');
}
