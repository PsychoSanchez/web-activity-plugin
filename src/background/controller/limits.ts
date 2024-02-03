import { Tab } from '@shared/browser-api.types';
import { getTotalActivity } from '@shared/db/sync-storage';
import { TimelineRecord } from '@shared/db/types';
import { getIsoDate } from '@shared/utils/dates-helper';
import { getHostNameFromUrl } from '@shared/utils/url';

import { greyOutTab, unGreyOutTab } from '../browser-api/tabs';

export async function handlePageLimitExceed(
  limits: Record<string, number>,
  focusedTab: Tab | null,
  activeTimeline: TimelineRecord | null,
) {
  if (!focusedTab?.url || !focusedTab?.id || !activeTimeline) {
    return;
  }

  const { url, id: tabId } = focusedTab;
  const hostname = getHostNameFromUrl(url);
  const limit = limits[hostname];

  // TODO:
  // If the limit was removed we need to un-grey out the tab
  // Find a way to do it without sending messages every time
  // For now there is a bug
  if (!limit) {
    return;
  }

  const now = Date.now();
  const websiteLimitInMs = limit * 60 * 1000;

  const activity = await getTotalActivity();
  const dailyActivity = activity[getIsoDate()]?.[hostname] ?? 0;

  const { activityPeriodStart = now, activityPeriodEnd = now } = activeTimeline;

  const currentActivity = activityPeriodEnd - activityPeriodStart;
  const totalDailyActivity = dailyActivity + currentActivity;

  if (totalDailyActivity > websiteLimitInMs) {
    await greyOutTab(tabId);
  } else {
    await unGreyOutTab(tabId);
  }
}
