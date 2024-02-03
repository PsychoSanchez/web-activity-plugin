import { setTotalDailyHostTime } from '@shared/db/sync-storage';
import { getActivityTimeline } from '@shared/tables/activity-timeline';

export async function updateTotalTime(
  currentIsoDate: string,
  hostname: string,
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
