import { connect, TimeTrackerStoreTables } from '../db/idb';
import { DomainInfo } from '../db/types';

export async function upsertDomainInfo(
  domain: string,
  info: DomainInfo,
): Promise<void> {
  const db = await connect();

  await db.put(TimeTrackerStoreTables.DomainInfo, info);
}

export async function getDomainInfo(
  domain: string,
): Promise<DomainInfo | undefined> {
  const db = await connect();

  return db.get(TimeTrackerStoreTables.DomainInfo, domain);
}

export async function countDomains(): Promise<number> {
  const db = await connect();

  return db.count(TimeTrackerStoreTables.DomainInfo);
}

export async function selectHostnames(
  hostnames: string[],
): Promise<DomainInfo[]> {
  const db = await connect();

  return Promise.all(
    hostnames.map((hostname) =>
      db.get(TimeTrackerStoreTables.DomainInfo, hostname),
    ),
  ).then((results) =>
    results.filter(
      (result): result is Exclude<typeof result, undefined> =>
        result !== undefined,
    ),
  );
}
