import * as React from 'react';
import { BrowserSyncStorage } from '../../shared/browser-sync-storage';
import { getIsoDate } from '../../shared/dates-helper';
import { DailyUsage } from './component';

import './styles.css';

export interface DailyUsageContainer {
  storage: BrowserSyncStorage;
}

export const DailyUsageContainer: React.FC<DailyUsageContainer> = ({
  storage,
}) => {
  const [date, setDate] = React.useState(getIsoDate(new Date()));
  const [dailyActivity, setDailyActivity] = React.useState<
    Record<string, number>
  >({});

  React.useEffect(() => {
    const storageListener = (activity: Record<string, any>) => {
      setDailyActivity(activity[date] || {});
    };

    storage.subscribe(storageListener);

    return () => {
      storage.unsubscribe(storageListener);
    };
  }, [date]);

  const totalDailyActivity =
    Object.values(dailyActivity).reduce((acc, val) => acc + val, 0) || 0;

  return (
    <div className="panel-body">
      <DailyUsage
        date={date}
        dailyActivity={dailyActivity}
        totalDailyActivity={totalDailyActivity}
      ></DailyUsage>
    </div>
  );
};
