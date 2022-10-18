import classNames from 'classnames/bind';
import * as React from 'react';

import { Panel, PanelHeader } from '../../blocks/Panel/Panel';
import { getMinutesInMs } from '../../shared/dates-helper';

import { TimeUsagePanel } from '../DailyTimeUsage/DailyTimeUsage';
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

export const DailyUsage: React.FC<DailyUsageProps> = React.memo(
  ({ date, dailyActivity, weeklyAverage, totalDailyActivity }) => {
    return (
      <div className={cx('daily-usage')}>
        <TimeUsagePanel time={totalDailyActivity} averageTime={weeklyAverage} />
        <Panel className={cx('daily-usage-chart-container')}>
          <PanelHeader>
            <i className="icon fi fi-rr-chart-pie-alt"></i>Top 5 Active Sites on {date}
          </PanelHeader>
          {totalDailyActivity > MINUTE_IN_MS ? (
            <div className={cx('daily-usage-chart')}>
              <DailyUsageChart
                date={date}
                activity={dailyActivity}
                totalDailyActivity={totalDailyActivity}
              />
            </div>
          ) : (
            <div className={cx('daily-usage-chart-empty', 'app-font')}>
              Nothing to see here yet...
            </div>
          )}
        </Panel>
      </div>
    );
  }
);
