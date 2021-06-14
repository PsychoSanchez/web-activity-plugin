import { BrowserSyncStorage } from '../../shared/browser-sync-storage';
import { getMinutesInMs } from '../../shared/dates-helper';

import { addActivityTimeToHost } from '../storage/overall';
import {
  ActivityEventListener,
  InactivityEventListener,
} from '../tracking/activity.tracker';

import { ActivityController } from './types';

const FIVE_MINUTES = getMinutesInMs(5);

export class OverallActivityController implements ActivityController {
  constructor(private storage: BrowserSyncStorage) {}
  onInactivityStart: InactivityEventListener = () => () => {};

  onActivityStart: ActivityEventListener = (tab, startTimestamp) => {
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
