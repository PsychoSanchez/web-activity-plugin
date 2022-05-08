import classNames from 'classnames/bind';
import * as React from 'react';

import { Panel, PanelBody, PanelHeader } from '../../blocks/Panel/Panel';
import { getTimeWithoutSeconds } from '../../shared/dates-helper';

import { GithubCalendarWrapper } from '../GithubCalendarWrapper/GithubCalendarWrapper';

import {
  convertCombinedDailyActivityToCalendarActivity,
  getCombinedTotalDailyActivity,
} from './helpers';
import { OverallActivityCalendarProps } from './types';

import styles from './styles.css';

const cx = classNames.bind(styles);

export const OverallActivityCalendarPanel: React.FC<OverallActivityCalendarProps> =
  ({ store, navigateToDateActivityPage }) => {
    const totalDailyActivity = getCombinedTotalDailyActivity(store);
    const calendarActivity =
      convertCombinedDailyActivityToCalendarActivity(totalDailyActivity);

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
      <Panel className={cx('calendar-panel')}>
        <PanelHeader className={cx('calendar-panel-header')}>
          Overall Activity Map
        </PanelHeader>
        <PanelBody className={cx('calendar-panel-body')}>
          <GithubCalendarWrapper
            activity={calendarActivity}
            onDateClick={navigateToDateActivityPage}
            getTooltip={getTooltipForDateButton}
          />
        </PanelBody>
      </Panel>
    );
  };
