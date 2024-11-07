import { DeepReadonly, Mutable } from 'utility-types';

import { ActiveTabState, TimelineRecord } from '@shared/db/types';
import { getSettings } from '@shared/preferences';
import { Tab } from '@shared/services/browser-api/types';
import { getActiveTabRecord, setActiveTabRecord } from '@shared/tables/state';
import { HostName, IsoDate } from '@shared/types';
import { getIsoDate, getMinutesInMs } from '@shared/utils/date';
import { getHostNameFromUrl, isInvalidUrl } from '@shared/utils/url';

import { updateTimeOnBadge } from './badge';
import { updateDomainInfo } from './domain-info';
import { handlePageLimitExceed } from './limits';
import { updateTotalTime } from './overall';
import { saveTimelineRecord } from './timeline';

const FIVE_MINUTES = getMinutesInMs(5);
export const handleStateChange = async (
  activeTabState: DeepReadonly<ActiveTabState>,
  timestamp: number = Date.now(),
) => {
  const [preferences, currentTimelineRecord] = await Promise.all([
    getSettings(),
    getActiveTabRecord(),
  ]);

  const focusedActiveTab = activeTabState.focusedActiveTab ?? null;
  const isLocked = activeTabState.idleState === 'locked';
  const isNotFocused = !focusedActiveTab;
  const isIdleAndNotAudible =
    activeTabState.idleState === 'idle' && !focusedActiveTab?.audible;

  const lastHeartbeatTs =
    currentTimelineRecord?.activityPeriodEnd ??
    currentTimelineRecord?.activityPeriodStart ??
    timestamp;
  const isImpossiblyLongEvent = timestamp - lastHeartbeatTs > FIVE_MINUTES;

  if (currentTimelineRecord) {
    const updatedTimelineRecord = structuredClone(
      currentTimelineRecord,
    ) as Mutable<typeof currentTimelineRecord>;
    updatedTimelineRecord.activityPeriodEnd = isImpossiblyLongEvent
      ? currentTimelineRecord.activityPeriodEnd
      : timestamp;

    await setActiveTabRecord(updatedTimelineRecord);
  }

  const isDomainIgnored = preferences.ignoredHosts.includes(
    currentTimelineRecord?.hostname ?? '',
  );

  const updatePageLimits = () => {
    if (!isDomainIgnored) {
      handlePageLimitExceed(
        preferences.limits,
        focusedActiveTab,
        currentTimelineRecord,
      );
    }
  };

  // Don't wait for these to finish
  Promise.all([
    updateTimeOnBadge(
      focusedActiveTab,
      currentTimelineRecord,
      preferences.displayTimeOnBadge && !isDomainIgnored,
    ),
    updateDomainInfo(focusedActiveTab),
    updatePageLimits(),
  ]);

  const isValidUrl = !isInvalidUrl(focusedActiveTab?.url);
  const isUrlChanged = currentTimelineRecord?.url !== focusedActiveTab?.url;

  if (
    isLocked ||
    isNotFocused ||
    isIdleAndNotAudible ||
    isImpossiblyLongEvent ||
    isUrlChanged
  ) {
    await commitTabActivity(currentTimelineRecord);

    if (focusedActiveTab && isValidUrl && isUrlChanged) {
      await createNewActiveRecord(timestamp, focusedActiveTab);
    }
  }
};

async function commitTabActivity(currentTimelineRecord: TimelineRecord | null) {
  if (!currentTimelineRecord) {
    return;
  }

  const currentIsoDate = getIsoDate(new Date());

  await saveTimelineRecord(currentTimelineRecord, currentIsoDate);

  // Edge case: If update happens after midnight, we need to update the
  // previous day's total time as well.
  // Dates in the array should be different in this case.
  const dates = Array.from(
    new Set([currentIsoDate, currentTimelineRecord.date as IsoDate]),
  );

  await Promise.all(
    dates.map((date) =>
      updateTotalTime(date, currentTimelineRecord.hostname as HostName),
    ),
  );

  await setActiveTabRecord(null);
}

async function createNewActiveRecord(timestamp: number, focusedActiveTab: Tab) {
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
