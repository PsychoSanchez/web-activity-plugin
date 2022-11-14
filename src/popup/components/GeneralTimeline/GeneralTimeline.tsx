import * as React from 'react';
import { twMerge } from 'tailwind-merge';

import { Icon, IconType } from '../../../blocks/Icon';
import { Panel, PanelBody, PanelHeader } from '../../../blocks/Panel';

import { TimelineChart } from '../TimelineChart/TimelineChart';

import { GeneralTimelineProps } from './types';

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
          <Icon type={IconType.TimePast} />
          {title}
          {filteredHostname ? ` On ${filteredHostname}` : ''}
        </PanelHeader>
        <PanelBody
          className={twMerge(
            'flex items-center justify-center min-h-[215px]',
            activityTimeline.length === 0 && 'hidden'
          )}
        >
          <TimelineChart
            emptyHoursMarginCount={emptyHoursMarginCount}
            timelineEvents={activityTimeline}
          />
        </PanelBody>
        {activityTimeline.length === 0 && (
          <span className="text-neutral-400">
            Doesn't have timeline data for this day
          </span>
        )}
      </Panel>
    );
  }
);
