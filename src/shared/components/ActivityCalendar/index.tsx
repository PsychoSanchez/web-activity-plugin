import * as React from 'react';
import Calendar from 'react-github-contribution-calendar';
import { Tooltip, TooltipRefProps } from 'react-tooltip';
import { debounce } from 'throttle-debounce';

import { IsoDate } from '@shared/types';
import { assertIsIsoDate, getIsoDate } from '@shared/utils/date';

import './ActivityCalendar.css';

export enum CalendarDisplayedActivityType {
  Inactive = 0,
  Low = 1,
  Medium = 2,
  High = 3,
}

export type CalendarDisplayedActivity = Record<
  IsoDate,
  CalendarDisplayedActivityType
>;

export type ActivityCalendarProps = {
  activity: CalendarDisplayedActivity;
  onDateClick: (isoDate: IsoDate) => void;
  getTooltip?: (isoDate: IsoDate) => string;
};

const INACTIVE_DAY_COLOR = '#cccccc';
const LOW_ACTIVITY_DAY_COLOR = '#839dde';
const MEDIUM_ACTIVITY_DAY_COLOR = '#4b76e3';
const HIGH_ACTIVITY_DAY_COLOR = '#103ba6';
const COLORS = [
  INACTIVE_DAY_COLOR,
  LOW_ACTIVITY_DAY_COLOR,
  MEDIUM_ACTIVITY_DAY_COLOR,
  HIGH_ACTIVITY_DAY_COLOR,
];

const BUTTON_DATE_ATTRIBUTE = 'data-date';
const REACT_TOOLTIP_ID = 'activity-calendar';
const REACT_TOOLTIP_SHOW_DELAY_MS = 100;

class GhCalendar extends Calendar {}

const getDefaultTooltip = (date: string) => date;

const debouncedSetCalendarTooltips = debounce(
  200,
  (
    calendarContainer: HTMLDivElement,
    getTooltip: Required<ActivityCalendarProps>['getTooltip'],
  ) => {
    const elements = calendarContainer.querySelectorAll('rect');

    const elementDate = new Date();
    Array.from(elements)
      .reverse()
      .forEach((el, index) => {
        elementDate.setDate(elementDate.getDate() - Math.min(1, index));

        const elementIsoDate = getIsoDate(elementDate);

        el.setAttribute(BUTTON_DATE_ATTRIBUTE, elementIsoDate);
        el.setAttribute('data-tooltip-content', getTooltip(elementIsoDate));
        el.setAttribute('data-tooltip-id', REACT_TOOLTIP_ID);
      });
  },
);

export const ActivityCalendar: React.FC<ActivityCalendarProps> = ({
  activity,
  onDateClick,
  getTooltip = getDefaultTooltip,
}) => {
  const calendarRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!calendarRef.current) {
      return;
    }

    debouncedSetCalendarTooltips(calendarRef.current, getTooltip);
  }, [getTooltip]);

  const handleDateClick = React.useCallback<
    NonNullable<React.ComponentProps<'div'>['onClick']>
  >(
    (el) => {
      const target = el.target as HTMLElement;
      if (target.nodeName !== 'rect') {
        return;
      }

      const date =
        target.getAttribute(BUTTON_DATE_ATTRIBUTE) || getIsoDate(new Date());

      assertIsIsoDate(date);
      onDateClick(date);
    },
    [onDateClick],
  );
  const ref = React.useRef<TooltipRefProps>(null);

  return (
    <div className="calendar" ref={calendarRef} onClick={handleDateClick}>
      <GhCalendar
        values={activity}
        until={getIsoDate(new Date())}
        panelColors={COLORS}
        weekLabelAttributes={undefined}
        monthLabelAttributes={undefined}
        panelAttributes={undefined}
      />

      <Tooltip
        ref={ref}
        id={REACT_TOOLTIP_ID}
        delayShow={REACT_TOOLTIP_SHOW_DELAY_MS}
      />
    </div>
  );
};
