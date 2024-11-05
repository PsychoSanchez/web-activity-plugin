import { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { getIsoDate } from '@shared/utils/date';

import { DatePicker } from '../DatePicker';

export default {
  title: 'Popup/components/DatePicker',
  component: DatePicker,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof DatePicker>;

type Story = StoryObj<Meta<typeof DatePicker>>;

const TODAY = getIsoDate(new Date());

export const Default: Story = {
  render: () => <DatePicker onChange={(date) => alert(date)} date={TODAY} />,
};
