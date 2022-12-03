import {
  connect,
  TimelineDatabase,
  TimeTrackerStoreTables,
} from '../../shared/db/idb';
import { ignore } from '../../shared/utils/errors';

import {
  isKeyAlreadyExistsError,
  isUnableToAddKeyToIndexError,
} from './errors';

export async function getActivityTimeline(isoDate: string) {
  const db = await connect();

  return db.getAllFromIndex(TimeTrackerStoreTables.Timeline, 'date', isoDate);
}

export async function getAllActivityTimeline() {
  const db = await connect();

  return db.getAll(TimeTrackerStoreTables.Timeline);
}

export async function putActivityTimelineRecord(
  val: TimelineDatabase['timeline']['value']
) {
  const db = await connect();
  return db
    .add(TimeTrackerStoreTables.Timeline, val)
    .catch(ignore(isKeyAlreadyExistsError, isUnableToAddKeyToIndexError));
}
