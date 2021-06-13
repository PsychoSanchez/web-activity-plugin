import classNames from 'classnames/bind';
import * as React from 'react';

import { Panel } from '../Panel/Panel';
import { DailyActivityTimelineChart } from '../TimelineChart/TimelineChart';

import { GeneralTimelineProps } from './types';

import styles from './styles.css';

const cx = classNames.bind(styles);

export const GeneralTimeline: React.FC<GeneralTimelineProps> = React.memo(
  ({
    filteredHostname,
    activityTimeline,
    title,
    emptyHoursMarginCount = 2,
  }) => {
    return (
      <>
        <Panel
          bodyClassName={cx('timeline-chart-body')}
          header={
            <span>
              {title}
              {filteredHostname ? ` On ${filteredHostname}` : ''}
            </span>
          }
        >
          <div
            className={cx(
              'timeline-chart',
              activityTimeline.length === 0 && 'timeline-chart-hidden'
            )}
          >
            <DailyActivityTimelineChart
              emptyHoursMarginCount={emptyHoursMarginCount}
              timelineEvents={activityTimeline}
            />
          </div>
          {activityTimeline.length === 0 && (
            <span className={cx('app-font', 'timeline-chart-empty')}>
              Doesn't have timeline data for this day
            </span>
          )}
        </Panel>
      </>
    );
  }
);
