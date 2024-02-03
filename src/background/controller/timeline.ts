import { TimelineRecord } from '@shared/db/types';
import { putActivityTimelineRecord } from '@shared/tables/activity-timeline';

export async function saveTimelineRecord(
  currentTimelineRecord: TimelineRecord,
  currentIsoDate: string,
) {
  if (currentTimelineRecord.date === currentIsoDate) {
    await putActivityTimelineRecord(currentTimelineRecord);
    return;
  }

  // Edge case: Event started before midnight and finished after
  const midnightToday = new Date(currentIsoDate).setHours(0);
  const millisecondBeforeMidnight = midnightToday - 1;

  // We need to split dates into 2 events for iso date index to work
  const yesterdayTimeline = { ...currentTimelineRecord };
  yesterdayTimeline.activityPeriodEnd = millisecondBeforeMidnight;

  currentTimelineRecord.activityPeriodStart = midnightToday;
  currentTimelineRecord.date = currentIsoDate;

  await putActivityTimelineRecord(yesterdayTimeline);
  await putActivityTimelineRecord(currentTimelineRecord);
}
