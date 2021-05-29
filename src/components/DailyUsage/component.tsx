import classNames from 'classnames/bind';
import * as React from 'react';

import {
  getMinutesInMs,
  getTimeWithoutSeconds,
} from '../../shared/dates-helper';

import { ActivityDatePicker } from '../ActivityDatePicker/component';
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

const presentTotalDailyActivity = (totalDailyActivity: number) => {
  if (totalDailyActivity < MINUTE_IN_MS) {
    return 'No Activity';
  }

  return getTimeWithoutSeconds(totalDailyActivity);
};

export const DailyUsage: React.FC<DailyUsageProps> = ({
  date,
  dailyActivity,
  weeklyAverage,
  totalDailyActivity,
}) => {
  const percent = Math.round((totalDailyActivity / weeklyAverage) * 100 - 100);

  const weekComparison = `${Math.abs(percent)} % ${
    percent < 0 ? 'lower ' : 'higher'
  } than this week average`;

  return (
    <div className={cx('panel', 'daily-usage')}>
      <div className={cx('daily-usage-header', 'app-font')}>
        <span className={cx('daily-usage-text')}>Daily Usage</span>
      </div>
      <div className={cx('daily-usage-time', 'app-font')}>
        <span className={cx('usage-time')}>
          {presentTotalDailyActivity(totalDailyActivity)}
        </span>
        <span className={cx('week-comparison')}>{weekComparison}</span>
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
