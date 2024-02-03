import * as React from 'react';

import { getTotalActivity } from '@shared/db/sync-storage';
import type { TimeStore } from '@shared/db/types';
import { getActiveTabRecord } from '@shared/tables/state';
import { getIsoDate } from '@shared/utils/dates-helper';

export { TimeStore };

export const useTimeStore = () => {
  const [store, setStore] = React.useState<TimeStore>({} as TimeStore);

  React.useEffect(() => {
    Promise.all([getTotalActivity(), getActiveTabRecord()]).then(
      ([activity, activeRecord]) => {
        if (activeRecord?.hostname) {
          const date = getIsoDate(new Date());
          const currentDayActivity = (activity[date] ??= {});
          currentDayActivity[activeRecord.hostname] ??= 0;
          currentDayActivity[activeRecord.hostname] +=
            activeRecord.activityPeriodEnd - activeRecord.activityPeriodStart;
        }

        setStore(activity);
      },
    );
  }, []);

  return store;
};
