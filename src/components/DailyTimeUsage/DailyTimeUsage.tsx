import classNames from 'classnames/bind';
import * as React from 'react';

import {
  getMinutesInMs,
  getTimeWithoutSeconds,
} from '../../shared/dates-helper';

import { DailyTimeUsageComponentProps } from './types';

import styles from './styles.css';

const cx = classNames.bind(styles);

const COMPONENT_TITLE = 'Daily Usage';
const MINUTE_IN_MS = getMinutesInMs(1);

const presentWeekComparison = (time: number, averageTime: number) => {
  const percent = Math.round((time / averageTime) * 100 - 100);

  const weekComparison = `${Math.abs(percent)} % ${
    percent < 0 ? 'lower ' : 'higher'
  } than this week average`;

  return weekComparison;
};

const presentTotalDailyActivity = (totalDailyActivity: number) => {
  if (totalDailyActivity < MINUTE_IN_MS) {
    return 'No Activity';
  }

  return getTimeWithoutSeconds(totalDailyActivity);
};

export const DailyTimeUsage: React.FC<DailyTimeUsageComponentProps> = ({
  time,
  averageTime = 0,
  title = COMPONENT_TITLE,
}) => {
  return (
    <div>
      <div className={cx('time-usage-header', 'app-font')}>
        <span className={cx('time-usage-text')}>{title}</span>
      </div>
      <div className={cx('time-usage-container', 'app-font')}>
        <span className={cx('time-usage')}>
          {presentTotalDailyActivity(time)}
        </span>
        {averageTime > 0 && (
          <span className={cx('time-usage-week-comparison')}>
            {presentWeekComparison(time, averageTime)}
          </span>
        )}
      </div>
    </div>
  );
};
