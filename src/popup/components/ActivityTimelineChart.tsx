import * as React from 'react';

import { Icon, IconType } from '@shared/blocks/Icon';
import { Panel, PanelBody, PanelHeader } from '@shared/blocks/Panel';
import { TimelineChart } from '@shared/components/TimelineChart';
import { TimelineRecord } from '@shared/db/types';
import { i18n } from '@shared/services/i18n';

export interface ActivityTimelineChartProps {
  title: string;
  emptyHoursMarginCount?: number;
  activityTimeline: TimelineRecord[];
  isDarkMode?: boolean;
}

const ActivityTimelineChartFC: React.FC<ActivityTimelineChartProps> = ({
  title,
  activityTimeline,
  emptyHoursMarginCount = 2,
  isDarkMode,
}) => {
  return (
    <Panel>
      <PanelHeader>
        <Icon type={IconType.TimePast} />
        {title}
      </PanelHeader>
      <PanelBody
        className={
          'relative flex items-center justify-center min-h-[215px] h-[215px] transition-opacity duration-300'
        }
      >
        {activityTimeline.length ? (
          <TimelineChart
            emptyHoursMarginCount={emptyHoursMarginCount}
            timelineEvents={activityTimeline}
            isDarkMode={isDarkMode}
          />
        ) : (
          <span
            className={
              'text-neutral-400 top-2 left-2 transition-opacity duration-75'
            }
          >
            {i18n('ActivityTimelineChart_NoData')}
          </span>
        )}
      </PanelBody>
    </Panel>
  );
};

export const ActivityTimelineChart: React.FC<ActivityTimelineChartProps> =
  React.memo(ActivityTimelineChartFC);
