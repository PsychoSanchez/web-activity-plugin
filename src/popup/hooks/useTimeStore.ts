import * as React from 'react';

import { getTotalActivity } from '@shared/db/sync-storage';
import type { TimeStore } from '@shared/db/types';
import { getActiveTabRecord } from '@shared/tables/state';
import { HostName } from '@shared/types';
import { getIsoDate } from '@shared/utils/date';

export { TimeStore };

export const useTimeStore = () => {
  const [store, setStore] = React.useState<TimeStore>({});

  React.useEffect(() => {
    Promise.all([getTotalActivity(), getActiveTabRecord()]).then(
      ([activity, activeRecord]) => {
        if (activeRecord?.hostname) {
          const hostname = activeRecord?.hostname as HostName;
          const date = getIsoDate(new Date());
          const currentDayActivity = (activity[date] ??= {});
          currentDayActivity[hostname] ??= 0;
          currentDayActivity[hostname] +=
            activeRecord.activityPeriodEnd - activeRecord.activityPeriodStart;
        }

        setStore(activity);
      },
    );
  }, []);

  return store;
};
