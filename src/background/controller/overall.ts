import { setTotalDailyHostTime } from '@shared/db/sync-storage';
import { getActivityTimeline } from '@shared/tables/activity-timeline';
import { HostName, IsoDate } from '@shared/types';

export async function updateTotalTime(
  currentIsoDate: IsoDate,
  hostname: HostName,
) {
  const timeline = await getActivityTimeline(currentIsoDate);
  const timeOnRecord = timeline
    .filter((t) => t.hostname === hostname)
    .reduce((acc, t) => acc + t.activityPeriodEnd - t.activityPeriodStart, 0);

  await setTotalDailyHostTime({
    host: hostname,
    date: currentIsoDate,
    duration: timeOnRecord,
  });
}
