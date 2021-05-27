import classNames from 'classnames/bind';
import * as React from 'react';

import {
  getTimeFromMs,
  getTimeWithoutSeconds,
} from '../../shared/dates-helper';

import styles from './styles.css';

const cx = classNames.bind(styles);

interface ActivityTableProps {
  activity: Record<string, number>;
}

export const ActivityTable: React.FC<ActivityTableProps> = ({
  activity = {},
}) => {
  const totalDailyActivity =
    Object.values(activity).reduce((acc, val) => acc + val, 0) || 0;

  return (
    <div className={cx('activity-table', 'panel')}>
      <div className={cx('panel-header', 'activity-table-header')}>
        <span>Websites This Day</span>
        <span>{getTimeWithoutSeconds(totalDailyActivity)}</span>
      </div>
      {Object.entries(activity)
        .sort(([, timeA], [, timeB]) => timeB - timeA)
        .map(([domain, time]) => {
          return (
            <div className={cx('activity-table-row')} key={domain}>
              <a
                className={cx('domain-link')}
                href={`https://${domain}`}
                target="_blank"
              >
                {domain}
              </a>
              <span className={cx('time-column')}>{getTimeFromMs(time)}</span>
            </div>
          );
        })}
    </div>
  );
};
