import { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { getIsoDate } from '@shared/utils/date';

import { ActivityTimeline } from '../GeneralTimeline';

export default {
  title: 'popup/components/ActivityTimeline',
  component: ActivityTimeline,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof ActivityTimeline>;

type Story = StoryObj<Meta<typeof ActivityTimeline>>;

export const EmptyTimeline: Story = {
  render: () => (
    <ActivityTimeline
      activityTimeline={[]}
      title="Activity in last 6 hours"
      emptyHoursMarginCount={2}
    />
  ),
};

export const Default: Story = {
  render: () => (
    <ActivityTimeline
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
