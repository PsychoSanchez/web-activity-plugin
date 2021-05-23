import classNames from 'classnames/bind';
import * as React from 'react';

import {
  getMinutesInMs,
  getTimeWithoutSeconds,
} from '../../shared/dates-helper';
import { ActivityDatePicker } from '../ActivityDatePicker/component';
import { DailyUsageChart } from '../DailyUsageChart/component';
import styles from './styles.css';

const cx = classNames.bind(styles);

export interface DailyUsageProps {
  date: string;
  onDateChange: React.ComponentProps<typeof ActivityDatePicker>['onChange'];
  totalDailyActivity: number;
  dailyActivity: Record<string, number>;
}

const MINUTE_IN_MS = getMinutesInMs(1);

const presentTotalDailyActivity = (totalDailyActivity: number) => {
  if (totalDailyActivity < MINUTE_IN_MS) {
    return 'No Activity';
  }

  return getTimeWithoutSeconds(totalDailyActivity);
};

export const DailyUsage: React.FC<DailyUsageProps> = ({
  date,
  onDateChange,
  dailyActivity,
  totalDailyActivity,
}) => {
  return (
    <div className={cx('panel', 'daily-usage')}>
      <div className={cx('daily-usage-header', 'app-font')}>
        <span className={cx('daily-usage-text')}>Daily Usage</span>
        {/* <ActivityDatePicker date={date} onChange={onDateChange} /> */}
      </div>
      <div className={cx('daily-usage-time', 'app-font')}>
        {presentTotalDailyActivity(totalDailyActivity)}
      </div>
      <div className={cx('daily-usage-chart-container')}>
        {totalDailyActivity > MINUTE_IN_MS ? (
          <div className={cx('daily-usage-chart')}>
            <DailyUsageChart
              date={date}
              activity={dailyActivity}
              totalDailyActivity={totalDailyActivity}
            ></DailyUsageChart>
          </div>
        ) : (
          <div className={cx('daily-usage-chart-empty', 'app-font')}>
            Nothing to see here yet...
          </div>
        )}
      </div>
    </div>
  );
};
