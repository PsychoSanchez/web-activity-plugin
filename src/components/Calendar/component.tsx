import * as React from 'react';
import './Calendar.css';

import Calendar from 'react-github-contribution-calendar';

import { ActivityCalendarProps } from './types';

const INACTIVE_DAY_COLOR = '#262944';
const LOW_ACTIVITY_DAY_COLOR = '#3d638c';
const MEDIUM_ACTIVITY_DAY_COLOR = '#4586cc';
const HIGH_ACTIVITY_DAY_COLOR = '#1b86f9';
const COLORS = [
  INACTIVE_DAY_COLOR,
  LOW_ACTIVITY_DAY_COLOR,
  MEDIUM_ACTIVITY_DAY_COLOR,
  HIGH_ACTIVITY_DAY_COLOR,
];

export const ActivityCalendar: React.FC<ActivityCalendarProps> = ({
  activity,
}) => {
  return (
    <div className="calendar">
      {/* @ts-ignore */}
      <Calendar values={activity} panelColors={COLORS} />
    </div>
  );
};
