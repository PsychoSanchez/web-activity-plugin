import { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { TimeStore } from '@shared/db/types';
import { PredefinedIsoDates } from '@shared/utils/date';

import { OverallActivityCalendar } from '../components/OverallActivityCalendar';

export default {
  title: 'popup/OverallPage components/OverallActivityCalendar',
  component: OverallActivityCalendar,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof OverallActivityCalendar>;

type Story = StoryObj<Meta<typeof OverallActivityCalendar>>;

const STORE = {
  [PredefinedIsoDates.today]: {
    'example.com': 10000000,
    'example.org': 20000,
  },
  [PredefinedIsoDates.yesterday]: {
    'example.com': 30000,
    'example.org': 40000,
  },
  [PredefinedIsoDates.lastMonth]: {
    'example.com': 50000,
    'example.org': 600000,
  },
} as unknown as TimeStore;

export const Default: Story = {
  render: () => (
    <OverallActivityCalendar
      onDateClick={(date) => alert(date)}
      store={STORE}
    />
  ),
};
