import * as React from 'react';

import { Icon, IconType } from '@shared/blocks/Icon';
import { Panel, PanelHeader } from '@shared/blocks/Panel';
import { getMinutesInMs } from '@shared/utils/dates-helper';

import { TimeUsagePanel } from '../../components/TimeUsagePanel';
import { DailyUsageChart } from './DailyUsageChart';

export interface DailyUsageProps {
  date: string;
  totalDailyActivity: number;
  weeklyAverage: number;
  dailyActivity: Record<string, number>;
}

const MINUTE_IN_MS = getMinutesInMs(1);

export const DailyUsageFC: React.FC<DailyUsageProps> = ({
  date,
  dailyActivity,
  weeklyAverage,
  totalDailyActivity,
}) => {
  return (
    <div>
      <TimeUsagePanel time={totalDailyActivity} averageTime={weeklyAverage} />
      <Panel className="min-h-[160px] flex flex-col justify-center">
        <PanelHeader>
          <Icon type={IconType.ChartPieAlt} />
          Top 5 Active Sites on {date}
        </PanelHeader>
        {totalDailyActivity > MINUTE_IN_MS ? (
          <div className="[&>canvas]:max-h-[150px]">
            <DailyUsageChart
              date={date}
              activity={dailyActivity}
              totalDailyActivity={totalDailyActivity}
            />
          </div>
        ) : (
          <div className="text-center text-neutral-800">
            Nothing to see here yet...
          </div>
        )}
      </Panel>
    </div>
  );
};

export const DailyUsage: React.FC<DailyUsageProps> = React.memo(DailyUsageFC);
