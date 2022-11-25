import * as React from 'react';
import { browser } from 'webextension-polyfill-ts';

import { getActiveTabRecord } from '../../background/tables/state';
import type { TimeStore } from '../../shared/db/types';

export { TimeStore };

export const useTimeStore = () => {
  const [store, setStore] = React.useState<TimeStore>({} as TimeStore);

  React.useEffect(() => {
    Promise.all([browser.storage.local.get(), getActiveTabRecord()]).then(
      ([activity, activeRecord]) => {
        if (activeRecord?.hostname) {
          activity[activeRecord.hostname] ??= 0;
          activity[activeRecord.hostname] +=
            activeRecord.activityPeriodEnd - activeRecord.activityPeriodStart;
        }

        setStore(activity);
      }
    );
  }, []);

  return store;
};
