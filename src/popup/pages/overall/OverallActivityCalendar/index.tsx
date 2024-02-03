import * as React from 'react';

import { Icon, IconType } from '@shared/blocks/Icon';
import { Panel, PanelBody, PanelHeader } from '@shared/blocks/Panel';
import { getTimeWithoutSeconds } from '@shared/utils/dates-helper';

import {
  GithubCalendarWrapper,
  TotalDailyActivity,
} from '../GithubCalendarWrapper';
import {
  convertCombinedDailyActivityToCalendarActivity,
  getCombinedTotalDailyActivity,
} from './helpers';

export interface OverallActivityCalendarProps {
  store: TotalDailyActivity;
  navigateToDateActivityPage: (isoDate: string) => void;
}

export const OverallActivityCalendarPanel: React.FC<
  OverallActivityCalendarProps
> = ({ store, navigateToDateActivityPage }) => {
  const totalDailyActivity = getCombinedTotalDailyActivity(store);
  const calendarActivity =
    convertCombinedDailyActivityToCalendarActivity(totalDailyActivity);

  const getTooltipForDateButton = React.useCallback(
    (isoDate) => {
      const time = totalDailyActivity[isoDate];
      if (time !== undefined) {
        return `${isoDate} ${getTimeWithoutSeconds(time)}`;
      }

      return isoDate;
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
        <GithubCalendarWrapper
          activity={calendarActivity}
          onDateClick={navigateToDateActivityPage}
          getTooltip={getTooltipForDateButton}
        />
      </PanelBody>
    </Panel>
  );
};
