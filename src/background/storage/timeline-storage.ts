import { DBSchema, openDB } from 'idb';

const DB_NAME = 'timeline';

export interface TimelineRecord {
  url: string;
  hostname: string;
  date: string;
  activityPeriod: [number, number];
}

export interface TimelineDatabase extends DBSchema {
  [DB_NAME]: {
    value: TimelineRecord;
    key: string;
    indexes: {
      date: string;
      hostname: string;
    };
  };
}

const dbPromise = openDB<TimelineDatabase>('surfing-timeline-store', 1, {
  upgrade(db) {
    const store = db.createObjectStore(DB_NAME, {
      // The 'id' property of the object will be the key.
      keyPath: 'id',
      // If it isn't explicitly set, create a value by auto incrementing.
      autoIncrement: true,
    });

    store.createIndex('date', 'date', { unique: false });
    store.createIndex('hostname', 'hostname', { unique: false });
  },
});

export async function getAllByIsoDate(isoDate: string) {
  return (await dbPromise).getAllFromIndex(DB_NAME, 'date', isoDate);
}

export async function saveTimeline(val: TimelineDatabase['timeline']['value']) {
  return (await dbPromise).add(DB_NAME, val);
}
