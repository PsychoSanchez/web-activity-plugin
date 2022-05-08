import classNames from 'classnames/bind';
import * as React from 'react';

import { Panel, PanelBody, PanelHeader } from '../../blocks/Panel/Panel';
import {
  getMinutesInMs,
  getTimeWithoutSeconds,
} from '../../shared/dates-helper';

import { DailyTimeUsageComponentProps } from './types';

import styles from './styles.css';

const cx = classNames.bind(styles);

const COMPONENT_TITLE = 'Daily Usage';
const MINUTE_IN_MS = getMinutesInMs(1);

const presentWeekComparison = (
  time: number,
  averageTime: number,
  averageTimeComparedTo: string
) => {
  const percent = Math.round((time / averageTime) * 100 - 100);

  const weekComparison = `${Math.abs(percent)} % ${
    percent < 0 ? 'lower ' : 'higher'
  } than ${averageTimeComparedTo}`;

  return weekComparison;
};

const presentTotalDailyActivity = (totalDailyActivity: number) => {
  if (totalDailyActivity < MINUTE_IN_MS) {
    return '< 1m';
  }

  return getTimeWithoutSeconds(totalDailyActivity);
};

export const TimeUsagePanel: React.FC<DailyTimeUsageComponentProps> = ({
  title = COMPONENT_TITLE,
  averageTimeComparedTo = 'this week average',
  time,
  averageTime = 0,
}) => {
  return (
    <Panel>
      <PanelHeader>{title}</PanelHeader>
      <PanelBody className={cx('time-usage-container')}>
        <span className={cx('time-usage')}>
          {presentTotalDailyActivity(time)}
        </span>
        {averageTime > 0 && (
          <span className={cx('time-usage-week-comparison')}>
            {presentWeekComparison(time, averageTime, averageTimeComparedTo)}
          </span>
        )}
      </PanelBody>
    </Panel>
  );
};
