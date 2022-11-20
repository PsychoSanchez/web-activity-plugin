import { Tab } from '../../shared/browser-api.types';
import { getCurrentHostTime } from '../../shared/db/sync-storage';
import { TimelineRecord } from '../../shared/db/types';
import { presentHoursOrMinutesFromMinutes } from '../../shared/utils/dates-helper';
import { getHostNameFromUrl } from '../../shared/utils/url';

import { setActionBadge, hideBadge } from '../browser-api/badge';

export async function updateTimeOnBadge(
  focusedActiveTab: Tab,
  currentTimelineRecord: TimelineRecord | null
) {
  if (!focusedActiveTab?.id) {
    return;
  }

  const [committedHostTime] = await Promise.all([
    focusedActiveTab.url
      ? getCurrentHostTime(getHostNameFromUrl(focusedActiveTab.url))
      : 0,
  ]);

  const notCommittedHostTime =
    (currentTimelineRecord?.activityPeriodEnd ?? 0) -
    (currentTimelineRecord?.activityPeriodStart ?? 0);

  const currentHostTimeInMinutes = Math.floor(
    (committedHostTime + notCommittedHostTime) / 1000 / 60
  );

  if (currentHostTimeInMinutes > 0) {
    await setActionBadge({
      text: presentHoursOrMinutesFromMinutes(currentHostTimeInMinutes),
      tabId: focusedActiveTab.id,
      color: '#4b76e3',
    });
  } else {
    await hideBadge(focusedActiveTab.id);
  }
}
