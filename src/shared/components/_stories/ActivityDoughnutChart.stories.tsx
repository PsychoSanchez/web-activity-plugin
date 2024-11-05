import { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { ActivitySummaryByHostname } from '@shared/db/types';

import { ActivityDoughnutChart } from '../ActivityDoughnutChart';

export default {
  title: 'Components/ActivityDoughnutChart',
  component: ActivityDoughnutChart,
} satisfies Meta<typeof ActivityDoughnutChart>;

type Story = StoryObj<Meta<typeof ActivityDoughnutChart>>;

const ACTIVITY_BY_HOSTNAME = {
  'example.com': 120000,
  'example.org': 45000,
  'example.net': 30000,
  'example.a': 30000,
  'example.v': 30000,
  'example.c': 30000,
} as unknown as ActivitySummaryByHostname;

export const Default: Story = {
  render: () => (
    <ActivityDoughnutChart
      datasetLabel="Daily Activity"
      activity={ACTIVITY_BY_HOSTNAME}
      isDarkMode={false}
    />
  ),
  parameters: {
    layout: 'centered',
  },
};

export const DarkMode: Story = {
  render: () => (
    <ActivityDoughnutChart
      datasetLabel="Daily Activity"
      activity={ACTIVITY_BY_HOSTNAME}
      isDarkMode={true}
    />
  ),
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'dark' },
  },
};
