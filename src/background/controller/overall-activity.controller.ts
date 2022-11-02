import { BrowserSyncStorage } from '../../shared/browser-sync-storage';
import { getMinutesInMs } from '../../shared/dates-helper';

import { addActivityTimeToHost } from '../storage/overall';
import {
  ActivityStartEventListener,
  ActiveTabListenerVisitor,
  InactivityStartEventListener,
} from '../tracking/activity.tracker';

const FIVE_MINUTES = getMinutesInMs(5);

export class OverallActivityVisitor implements ActiveTabListenerVisitor {
  constructor(private storage: BrowserSyncStorage) { }
  onInactivityStart: InactivityStartEventListener = () => () => { };

  onActivityStart: ActivityStartEventListener = (tab, startTimestamp) => {
    const { url = '' } = tab;
    const { hostname } = new URL(url);

    const savedHostname = hostname || url;
    console.log(savedHostname, 'Active');

    return (endTimestamp) => {
      const activityTime = endTimestamp - startTimestamp;

      // Skip impossibly long events
      if (activityTime > FIVE_MINUTES) {
        return;
      }

      console.log(savedHostname, activityTime);

      addActivityTimeToHost(this.storage, savedHostname, activityTime);
    };
  };
}
