import classNames from 'classnames/bind';
import * as React from 'react';

import {
  getTimeFromMs,
  getTimeWithoutSeconds,
} from '../../shared/dates-helper';

import { ActivityTableProps } from './types';

import styles from './styles.modules.css';

const cx = classNames.bind(styles);

const DEFAULT_TITLE = 'Websites This Day';

export const ActivityTable: React.FC<ActivityTableProps> = React.memo(
  ({ activity = {}, title = DEFAULT_TITLE, onDomainRowClicked }) => {
    const totalActivity =
      Object.values(activity).reduce((acc, val) => acc + val, 0) || 0;

    const handleDomainRowClick = React.useCallback(
      (domain: string) => onDomainRowClicked?.(domain),
      [onDomainRowClicked]
    );

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
                  title={domain}
                  onClick={() => handleDomainRowClick(domain)}
                >
                  {domain}
                </a>
                {/* <button
                  className={cx('add-to-ignore-button')}
                  title="Hide this website"
                >
                  -
                </button> */}
                <span className={cx('time-column')}>{getTimeFromMs(time)}</span>
              </div>
            );
          })}
      </div>
    );
  }
);
