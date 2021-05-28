import classNames from 'classnames/bind';
import * as React from 'react';
import Calendar from 'react-github-contribution-calendar';
import ReactTooltip from 'react-tooltip';
import { debounce } from 'throttle-debounce';

import { getIsoDate } from '../../shared/dates-helper';

import { ActivityCalendarProps } from './types';

import styles from './component.css';

const cx = classNames.bind(styles);

const INACTIVE_DAY_COLOR = '#262944';
const LOW_ACTIVITY_DAY_COLOR = '#5f607e';
const MEDIUM_ACTIVITY_DAY_COLOR = '#9d9dbc';
const HIGH_ACTIVITY_DAY_COLOR = '#dfdfff';
const COLORS = [
  INACTIVE_DAY_COLOR,
  LOW_ACTIVITY_DAY_COLOR,
  MEDIUM_ACTIVITY_DAY_COLOR,
  HIGH_ACTIVITY_DAY_COLOR,
];

const BUTTON_DATE_ATTRIBUTE = 'data-date';

const debouncedSetCalendarTooltipDates = debounce(
  200,
  (calendarContainer: HTMLDivElement) => {
    const elements = calendarContainer.querySelectorAll('rect');

    const today = new Date();
    Array.from(elements)
      .reverse()
      .forEach((el, index) => {
        today.setDate(today.getDate() - Math.min(1, index));

        el.setAttribute(BUTTON_DATE_ATTRIBUTE, getIsoDate(today));
        el.setAttribute('data-tip', getIsoDate(today));
        el.setAttribute('data-for', 'calendar');
      });

    ReactTooltip.rebuild();
  }
);

export const ActivityCalendar: React.FC<ActivityCalendarProps> = ({
  activity,
  navigateToDateActivityPage,
}) => {
  const calendarRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (!calendarRef.current) {
      return;
    }

    debouncedSetCalendarTooltipDates(calendarRef.current);
  }, []);

  const handleDateClick = React.useCallback((el) => {
    const target = el.target as HTMLElement;
    if (target.nodeName === 'rect') {
      navigateToDateActivityPage(
        target.getAttribute(BUTTON_DATE_ATTRIBUTE) || getIsoDate(new Date())
      );
    }
  }, []);

  return (
    <div className={cx('calendar')} ref={calendarRef} onClick={handleDateClick}>
      {/* @ts-ignore */}
      <Calendar values={activity} panelColors={COLORS} />
      <ReactTooltip id="calendar" />
    </div>
  );
};
