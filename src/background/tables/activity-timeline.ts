import {
  connect,
  TimelineDatabase,
  TimeTrackerStoreTables,
} from '../../shared/db/idb';

export async function getActivityTimeline(isoDate: string) {
  const db = await connect();

  return db.getAllFromIndex(TimeTrackerStoreTables.Timeline, 'date', isoDate);
}

export async function saveActivityTimelineRecord(
  val: TimelineDatabase['timeline']['value']
) {
  const db = await connect();
  await db.add(TimeTrackerStoreTables.Timeline, val);
}
