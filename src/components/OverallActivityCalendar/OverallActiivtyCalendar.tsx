import classNames from 'classnames/bind';
import * as React from 'react';

import { getTimeWithoutSeconds } from '../../shared/dates-helper';

import { GithubCalendarWrapper } from '../GithubCalendarWrapper/GithubCalendarWrapper';

import {
  convertCombinedDailyActiityToCalendarActivity,
  getCombinedTotalDailyActivity,
} from './helpers';
import { OverallActivityCalendarProps } from './types';

import styles from './styles.modules.css';

const cx = classNames.bind(styles);

export const OverallActivityCalendarPanel: React.FC<OverallActivityCalendarProps> =
  ({ store, navigateToDateActivityPage }) => {
    const totalDailyActivity = getCombinedTotalDailyActivity(store);
    const calendarActivity =
      convertCombinedDailyActiityToCalendarActivity(totalDailyActivity);

    const getTooltipForDateButton = React.useCallback(
      (isoDate) => {
        if (isoDate in totalDailyActivity) {
          return `${isoDate} ${getTimeWithoutSeconds(
            totalDailyActivity[isoDate]
          )}`;
        }

        return isoDate;
      },
      [totalDailyActivity]
    );

    return (
      <div className={cx('calendar-panel', 'panel')}>
        <div className={cx('panel-header', 'calendar-panel-header')}>
          Overall Activity Map
        </div>
        <div className={cx('calendar-panel-body', 'panel-body')}>
          <GithubCalendarWrapper
            activity={calendarActivity}
            onDateClick={navigateToDateActivityPage}
            getTooltip={getTooltipForDateButton}
          />
        </div>
      </div>
    );
  };
