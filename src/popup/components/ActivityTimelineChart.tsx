import { Activity } from 'lucide-react';
import * as React from 'react';

import { TimelineChart } from '@shared/components/TimelineChart';
import { TimelineRecord } from '@shared/db/types';
import { i18n } from '@shared/services/i18n';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card';

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
    <Card>
      <CardHeader>
        <CardTitle className="flex gap-2">
          <Activity size={16} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent
        className={
          'relative flex items-center justify-center min-h-[215px] h-[215px] duration-300'
        }
      >
        {activityTimeline.length ? (
          <TimelineChart
            emptyHoursMarginCount={emptyHoursMarginCount}
            timelineEvents={activityTimeline}
            isDarkMode={isDarkMode}
          />
        ) : (
          <span className={'text-neutral-400 top-2 left-2 duration-75'}>
            {i18n('ActivityTimelineChart_NoData')}
          </span>
        )}
      </CardContent>
    </Card>
  );
};

export const ActivityTimelineChart: React.FC<ActivityTimelineChartProps> =
  React.memo(ActivityTimelineChartFC);
