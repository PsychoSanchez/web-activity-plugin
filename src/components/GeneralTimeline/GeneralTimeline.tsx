import classNames from 'classnames/bind';
import * as React from 'react';

import { Panel, PanelBody, PanelHeader } from '../../blocks/Panel/Panel';

import { TimelineChart } from '../TimelineChart/TimelineChart';

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
      <Panel>
        <PanelHeader>
          {title}
          {filteredHostname ? ` On ${filteredHostname}` : ''}
        </PanelHeader>
        <PanelBody
          className={cx(
            'timeline-chart',
            'timeline-chart-body',
            activityTimeline.length === 0 && 'timeline-chart-hidden'
          )}
        >
          <TimelineChart
            emptyHoursMarginCount={emptyHoursMarginCount}
            timelineEvents={activityTimeline}
          />
        </PanelBody>
        {activityTimeline.length === 0 && (
          <span className={cx('timeline-chart-empty')}>
            Doesn't have timeline data for this day
          </span>
        )}
      </Panel>
    );
  }
);
