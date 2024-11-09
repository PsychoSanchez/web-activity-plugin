import { History } from 'lucide-react';
import * as React from 'react';

import { i18n } from '@shared/services/i18n';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card';
import { getMinutesInMs, getTimeWithoutSeconds } from '@shared/utils/date';

export interface TimeUsagePanelProps {
  title: string;
  averageTime?: number;
  totalActivityTime: number;
}

const MINUTE_IN_MS = getMinutesInMs(1);

const LOWER_SPAN = (
  <span className="text-green-600">{i18n('TimeUsagePanel_LowerSpan')}</span>
);
const HIGHER_SPAN = (
  <span className="text-red-600">{i18n('TimeUsagePanel_HigherSpan')}</span>
);

const presentWeekComparison = (time: number, averageTime: number) => {
  const percent = Math.round((time / averageTime) * 100 - 100);

  return (
    <span>
      <span>{Math.abs(percent)} % </span>
      {percent < 0 ? LOWER_SPAN : HIGHER_SPAN}
      <span>{' ' + i18n('TimeUsagePanel_ThanAverageSpan')}</span>
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
  title,
  totalActivityTime: time,
  averageTime = 0,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex gap-2">
          <History size={16} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex justify-between items-center text-3xl">
        <span className="font-light">{presentTotalDailyActivity(time)}</span>
        {averageTime > 0 && (
          <span className="flex flex-col text-xs items-end">
            <span className="font-light text-xs">
              {i18n('TimeUsagePanel_7DayAverageTime', {
                time: presentTotalDailyActivity(averageTime),
              })}
            </span>
            {presentWeekComparison(time, averageTime)}
          </span>
        )}
      </CardContent>
    </Card>
  );
};
