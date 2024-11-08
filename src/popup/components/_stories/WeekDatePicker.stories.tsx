import { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { getDatesWeekSundayDate } from '@shared/utils/date';

import { WeekDatePicker } from '../WeekDatePicker';

export default {
  title: 'Popup/components/WeekDatePicker',
  component: WeekDatePicker,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof WeekDatePicker>;

type Story = StoryObj<Meta<typeof WeekDatePicker>>;

const SUNDAY_DATE = getDatesWeekSundayDate(new Date());

export const Default: Story = {
  render: () => (
    <WeekDatePicker
      onWeekChange={(date) => alert(date)}
      sundayDate={SUNDAY_DATE}
    />
  ),
};
