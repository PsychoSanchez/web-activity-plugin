import { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { getIsoDate } from '@shared/utils/date';

import { ActivityTimelineChart } from '../ActivityTimelineChart';

export default {
  title: 'popup/components/ActivityTimelineChart',
  component: ActivityTimelineChart,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof ActivityTimelineChart>;

type Story = StoryObj<Meta<typeof ActivityTimelineChart>>;

export const EmptyTimeline: Story = {
  render: () => (
    <ActivityTimelineChart
      activityTimeline={[]}
      title="Activity in last 6 hours"
      emptyHoursMarginCount={2}
    />
  ),
};

export const Default: Story = {
  render: () => (
    <ActivityTimelineChart
      activityTimeline={[
        {
          activityPeriodEnd: new Date().getTime(),
          activityPeriodStart: new Date().getTime() - 1000 * 60 * 60,
          hostname: 'example.com',
          date: getIsoDate(new Date()),
          docTitle: 'Example',
          tabId: 1,
          url: 'https://example.com',
        },
      ]}
      title="Activity in last 6 hours"
      emptyHoursMarginCount={2}
    />
  ),
};
