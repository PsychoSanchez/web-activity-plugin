import classNames from 'classnames/bind';
import * as React from 'react';

import {
  getTimeFromMs,
  getTimeWithoutSeconds,
} from '../../shared/dates-helper';

import { ActivityTableProps } from './types';

import styles from './styles.css';

const cx = classNames.bind(styles);

const DEFAULT_TITLE = 'Websites This Day';

export const ActivityTable: React.FC<ActivityTableProps> = ({
  activity = {},
  title = DEFAULT_TITLE,
}) => {
  const totalActivity =
    Object.values(activity).reduce((acc, val) => acc + val, 0) || 0;

  return (
    <div className={cx('activity-table', 'panel')}>
      <div className={cx('panel-header', 'activity-table-header')}>
        <span>{title}</span>
        <span>{getTimeWithoutSeconds(totalActivity)}</span>
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
