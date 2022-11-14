import { connect, TimelineDatabase, TIMELINE_TABLE_NAME } from './idb';

export async function getActivityTimeline(isoDate: string) {
  const db = await connect();

  return db.getAllFromIndex(TIMELINE_TABLE_NAME, 'date', isoDate);
}

export async function saveActivityTimelineRecord(
  val: TimelineDatabase['timeline']['value']
) {
  const db = await connect();
  await db.add(TIMELINE_TABLE_NAME, val);
}
