import * as React from 'react';
import classNames from 'classnames/bind';

import { getHoursInMs, getMinutesInMs } from '../../shared/dates-helper';
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
const HOURS_IN_MS = getHoursInMs(1);

const presentTotalDailyActivity = (totalDailyActivity: number) => {
  if (totalDailyActivity < MINUTE_IN_MS) {
    return 'No Activity';
  }

  const minutes = Math.floor((totalDailyActivity / MINUTE_IN_MS) % 60);
  const hours = Math.floor((totalDailyActivity / HOURS_IN_MS) % 24);

  return `${hours > 0 ? `${hours}h ` : ''}${minutes}m`;
};

export const DailyUsage: React.FC<DailyUsageProps> = ({
  date,
  onDateChange,
  dailyActivity,
  totalDailyActivity,
}) => {
  return (
    <div>
      <div className={cx('daily-usage-header', 'app-font')}>
        <span className={cx('daily-usage-text')}>Daily Usage</span>
        <ActivityDatePicker date={date} onChange={onDateChange} />
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
      {/* <AppsDailyUsageTable></AppsDailyUsageTable> */}
    </div>
  );
};
