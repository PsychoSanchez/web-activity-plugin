import * as React from 'react';

import { Icon, IconType } from '@shared/blocks/Icon';
import { Panel, PanelBody, PanelHeader } from '@shared/blocks/Panel';
import {
  getMinutesInMs,
  getTimeWithoutSeconds,
} from '@shared/utils/dates-helper';

export interface TimeUsagePanelProps {
  title?: string;
  averageTime?: number;
  averageTimeComparedTo?: string;
  time: number;
}

const COMPONENT_TITLE = 'Daily Usage';
const MINUTE_IN_MS = getMinutesInMs(1);

const LOWER_SPAN = <span className="text-green-600">lower</span>;
const HIGHER_SPAN = <span className="text-red-600">higher</span>;

const presentWeekComparison = (
  time: number,
  averageTime: number,
  averageTimeComparedTo: string,
) => {
  const percent = Math.round((time / averageTime) * 100 - 100);

  return (
    <span>
      <span>{Math.abs(percent)} % </span>
      {percent < 0 ? LOWER_SPAN : HIGHER_SPAN}
      <span> than {averageTimeComparedTo}</span>
    </span>
  );
};

const presentTotalDailyActivity = (totalDailyActivity: number) => {
  if (totalDailyActivity < MINUTE_IN_MS) {
    return '< 1m';
  }

  return getTimeWithoutSeconds(totalDailyActivity);
};

export const TimeUsagePanel: React.FC<TimeUsagePanelProps> = ({
  title = COMPONENT_TITLE,
  averageTimeComparedTo = 'average',
  time,
  averageTime = 0,
}) => {
  return (
    <Panel>
      <PanelHeader>
        <Icon type={IconType.TimeCheck} />
        {title}
      </PanelHeader>
      <PanelBody className="flex justify-between items-center text-3xl">
        <span className="font-light">{presentTotalDailyActivity(time)}</span>
        {averageTime > 0 && (
          <span className="flex flex-col text-xs items-end">
            <span className="font-light text-xs">
              7 days average: {presentTotalDailyActivity(averageTime)}
            </span>
            {presentWeekComparison(time, averageTime, averageTimeComparedTo)}
          </span>
        )}
      </PanelBody>
    </Panel>
  );
};
