import * as React from 'react';
import { browser } from 'webextension-polyfill-ts';

import { getActiveTabRecord } from '../../background/tables/state';
import { TimeStore } from '../../shared/db/types';

export type AppStore = TimeStore;

export const useTimeStore = () => {
  const [store, setStore] = React.useState<AppStore>({} as AppStore);

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
