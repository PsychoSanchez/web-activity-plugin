import { CalendarSearch } from 'lucide-react';
import React, { useCallback, useMemo } from 'react';

import {
  ActivityCalendar,
  CalendarDisplayedActivity,
  CalendarDisplayedActivityType,
} from '@shared/components/ActivityCalendar';
import { TimeStore } from '@shared/db/types';
import { i18n } from '@shared/services/i18n';
import { IsoDate } from '@shared/types';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card';
import { getHoursInMs, getMinutesInMs } from '@shared/utils/date';

import {
  getTotalDailyActivity,
  ActivitySummaryByDate,
  transformDailyActivityValues,
} from '@popup/services/time-store';

export const getCalendarActivity = (
  totalActivity: ActivitySummaryByDate,
): CalendarDisplayedActivity =>
  transformDailyActivityValues(totalActivity, (_date, timeMs) => {
    if (timeMs < getMinutesInMs(1)) {
      return CalendarDisplayedActivityType.Inactive;
    }

    if (timeMs < getHoursInMs(2.5)) {
      return CalendarDisplayedActivityType.Low;
    }

    if (timeMs < getHoursInMs(7)) {
      return CalendarDisplayedActivityType.Medium;
    }

    return CalendarDisplayedActivityType.High;
  });

export interface OverallActivityCalendarProps {
  store: TimeStore;
  onDateClick: (isoDate: IsoDate) => void;
}

export const OverallActivityCalendar: React.FC<
  OverallActivityCalendarProps
> = ({ store, onDateClick }) => {
  const totalDailyActivity = useMemo(
    () => getTotalDailyActivity(store),
    [store],
  );

  const calendarActivity = useMemo(
    () => getCalendarActivity(totalDailyActivity),
    [totalDailyActivity],
  );

  const getTooltipForDateButton = useCallback(
    (isoDate: IsoDate) => {
      return [isoDate, totalDailyActivity[isoDate]]
        .filter((value) => value !== undefined)
        .join(' ');
    },
    [totalDailyActivity],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex gap-2">
          <CalendarSearch size={16} />
          {i18n('OverallActivityCalendar_Header')}
        </CardTitle>
      </CardHeader>
      <CardContent className="min-h-[115px]">
        <ActivityCalendar
          activity={calendarActivity}
          onDateClick={onDateClick}
          getTooltip={getTooltipForDateButton}
        />
      </CardContent>
    </Card>
  );
};
