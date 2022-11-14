import { connect } from './idb';

export async function logMessage(message: string) {
  if (process.env.NODE_ENV === 'production') {
    return;
  }

  const db = await connect();

  await db.add('logs', { message, timestamp: Date.now() });
}
