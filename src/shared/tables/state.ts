import { DeepReadonly } from 'utility-types';

import {
  connect,
  TimeTrackerStoreStateTableKeys,
  TimeTrackerStoreTables,
} from '@shared/db/idb';
import { ActiveTabState, TimelineRecord } from '@shared/db/types';

export async function setActiveTabRecord(
  val: DeepReadonly<TimelineRecord> | null,
) {
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
  )) as DeepReadonly<TimelineRecord> | null;
}

export async function getTabsState() {
  const db = await connect();

  return (await db.get(
    TimeTrackerStoreTables.State,
    TimeTrackerStoreStateTableKeys.AppState,
  )) as DeepReadonly<ActiveTabState>;
}

export async function setTabsState(val: DeepReadonly<ActiveTabState>) {
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
