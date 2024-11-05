import * as React from 'react';

import { Icon, IconType } from '@shared/blocks/Icon';
import { Panel, PanelHeader } from '@shared/blocks/Panel';
import { ActivityDoughnutChart } from '@shared/components/ActivityDoughnutChart';
import { IsoDate } from '@shared/types';
import { getMinutesInMs } from '@shared/utils/date';

import { useIsDarkMode } from '@popup/hooks/useTheme';
import { ActivitySummaryByHostname } from '@popup/services/time-store';

import { TimeUsagePanel } from '../../components/TimeUsagePanel';

export interface DailyUsageProps {
  totalActivityTime: number;
  activityByDate: ActivitySummaryByHostname;
  date: IsoDate;
  weeklyAverage: number;
}

const MINUTE_IN_MS = getMinutesInMs(1);

export const DailyUsageFC: React.FC<DailyUsageProps> = ({
  date,
  activityByDate,
  weeklyAverage,
  totalActivityTime,
}) => {
  const isDarkMode = useIsDarkMode();
  return (
    <div>
      <TimeUsagePanel time={totalActivityTime} averageTime={weeklyAverage} />
      <Panel className="min-h-[160px] flex flex-col justify-center">
        <PanelHeader>
          <Icon type={IconType.ChartPieAlt} />
          Top 5 Active Sites on {date}
        </PanelHeader>
        {totalActivityTime > MINUTE_IN_MS ? (
          <div className="[&>canvas]:max-h-[150px]">
            <ActivityDoughnutChart
              datasetLabel={date}
              activity={activityByDate}
              isDarkMode={isDarkMode}
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
