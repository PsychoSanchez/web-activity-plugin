import React, { useCallback, useMemo } from 'react';

import { Icon, IconType } from '@shared/blocks/Icon';
import { Panel, PanelBody, PanelHeader } from '@shared/blocks/Panel';
import {
  ActivityCalendar,
  CalendarDisplayedActivity,
  CalendarDisplayedActivityType,
} from '@shared/components/ActivityCalendar';
import { TimeStore } from '@shared/db/types';
import { IsoDate } from '@shared/types';
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
    <Panel>
      <PanelHeader>
        <Icon type={IconType.CalendarClock} />
        Overall Activity Map
      </PanelHeader>
      <PanelBody className="min-h-[115px]">
        <ActivityCalendar
          activity={calendarActivity}
          onDateClick={onDateClick}
          getTooltip={getTooltipForDateButton}
        />
      </PanelBody>
    </Panel>
  );
};

/// SCHADCN UI
// WINDOW AI
