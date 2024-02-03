import { Tab } from '@shared/browser-api.types';
import { TimelineRecord } from '@shared/db/types';
import { getActiveTabRecord, setActiveTabRecord } from '@shared/tables/state';
import { getIsoDate } from '@shared/utils/dates-helper';
import { getHostNameFromUrl } from '@shared/utils/url';

export class ActiveTimelineRecordDao {
  private record: null | Promise<TimelineRecord | null> = null;

  public get(): Promise<TimelineRecord | null> {
    if (!this.record) {
      this.record = getActiveTabRecord();
    }

    return this.record;
  }

  public async set(record: TimelineRecord) {
    this.record = Promise.resolve(record);

    await setActiveTabRecord(record);
  }

  public async isExist() {
    const record = await this.get();
    return !!record;
  }
}

export async function createNewActiveRecord(
  timestamp: number,
  focusedActiveTab: Tab,
) {
  if (!focusedActiveTab.id) {
    return;
  }
  const date = getIsoDate(new Date(timestamp));
  const { url = '', title = '' } = focusedActiveTab;
  const hostname = getHostNameFromUrl(url);

  await setActiveTabRecord({
    tabId: focusedActiveTab.id,
    url,
    hostname,
    docTitle: title,
    date,
    activityPeriodStart: timestamp,
    activityPeriodEnd: timestamp,
  });
}
