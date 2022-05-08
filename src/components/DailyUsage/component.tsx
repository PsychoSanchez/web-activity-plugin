import classNames from 'classnames/bind';
import * as React from 'react';

import { getMinutesInMs } from '../../shared/dates-helper';

import { TimeUsagePanel } from '../DailyTimeUsage/DailyTimeUsage';
import { DailyUsageChart } from '../TopFiveActiveSitesChart/TopFiveActiveSitesChart';

import styles from './styles.css';

const cx = classNames.bind(styles);

export interface DailyUsageProps {
  date: string;
  totalDailyActivity: number;
  weeklyAverage: number;
  dailyActivity: Record<string, number>;
}

const MINUTE_IN_MS = getMinutesInMs(1);

export const DailyUsage: React.FC<DailyUsageProps> = React.memo(
  ({ date, dailyActivity, weeklyAverage, totalDailyActivity }) => {
    return (
      <div className={cx('panel', 'daily-usage')}>
        <TimeUsagePanel time={totalDailyActivity} averageTime={weeklyAverage} />
        <div className={cx('daily-usage-chart-container')}>
          {totalDailyActivity > MINUTE_IN_MS ? (
            <div className={cx('daily-usage-chart')}>
              <DailyUsageChart
                date={date}
                activity={dailyActivity}
                totalDailyActivity={totalDailyActivity}
              />
            </div>
          ) : (
            <div className={cx('daily-usage-chart-empty', 'app-font')}>
              Nothing to see here yet...
            </div>
          )}
        </div>
      </div>
    );
  }
);
