import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';

import { getIsoDate } from '@shared/utils/date';

import {
  ActivityCalendar,
  CalendarDisplayedActivityType,
} from '../ActivityCalendar';

const meta: Meta<typeof ActivityCalendar> = {
  title: 'Components/ActivityCalendar',
  component: ActivityCalendar,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof ActivityCalendar>;

export default meta;
type Story = StoryObj<typeof meta>;

const today = new Date();
const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
const date3 = new Date(weekAgo.getTime() - 24 * 60 * 60 * 1000);
const date4 = new Date(date3.getTime() - 2 * 24 * 60 * 60 * 1000);
const date5 = new Date(date4.getTime() - 3 * 24 * 60 * 60 * 1000);

const sampleActivity = {
  [getIsoDate(today)]: CalendarDisplayedActivityType.High,
  [getIsoDate(weekAgo)]: CalendarDisplayedActivityType.Medium,
  [getIsoDate(date3)]: CalendarDisplayedActivityType.Low,
  [getIsoDate(date4)]: CalendarDisplayedActivityType.Inactive,
  [getIsoDate(date5)]: CalendarDisplayedActivityType.High,
};

const defaultTooltip = (date: string) => `Activity on ${date}`;

export const Default: Story = {
  render: () => (
    <ActivityCalendar
      activity={sampleActivity}
      getTooltip={defaultTooltip}
      onDateClick={(date) => alert(`Clicked on date: ${date}`)}
    />
  ),
};
