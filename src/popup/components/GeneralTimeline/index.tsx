import * as React from 'react';
import { twMerge } from 'tailwind-merge';

import { Icon, IconType } from '@shared/blocks/Icon';
import { Panel, PanelBody, PanelHeader } from '@shared/blocks/Panel';
import { TimelineRecord } from '@shared/db/types';

import { TimelineChart } from './TimelineChart';

export interface GeneralTimelineProps {
  title: string;
  emptyHoursMarginCount?: number;
  filteredHostname?: string | null;
  activityTimeline: TimelineRecord[];
}

const GeneralTimelineFC: React.FC<GeneralTimelineProps> = ({
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
          'relative flex items-center justify-center min-h-[215px] h-[215px] transition-opacity duration-300 opacity-0',
          activityTimeline.length > 0 && 'opacity-100',
        )}
      >
        <TimelineChart
          emptyHoursMarginCount={emptyHoursMarginCount}
          timelineEvents={activityTimeline}
        />
        <span
          className={twMerge(
            'absolute text-neutral-400 top-2 left-2 transition-opacity duration-75 opacity-0',
            activityTimeline.length === 0 && 'opacity-100',
          )}
        >
          Don&apos;t have timeline data for this day
        </span>
      </PanelBody>
    </Panel>
  );
};

export const GeneralTimeline: React.FC<GeneralTimelineProps> =
  React.memo(GeneralTimelineFC);
