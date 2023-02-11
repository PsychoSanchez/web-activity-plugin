import { connect, TimeTrackerStoreTables } from '../db/idb';

export async function logMessage(message: string) {
  if (process.env.NODE_ENV === 'production') {
    return;
  }

  console.log(message);

  const db = await connect();

  await db.add(TimeTrackerStoreTables.Logs, { message, timestamp: Date.now() });
}
