import { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { getIsoDate } from '@shared/utils/date';

import { TimeUsagePanel } from '../TimeUsagePanel';

export default {
  title: 'popup/components/TimeUsagePanel',
  component: TimeUsagePanel,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof TimeUsagePanel>;

type Story = StoryObj<Meta<typeof TimeUsagePanel>>;

export const EmptyTimeline: Story = {
  render: () => (
    <div className="w-[300px]">
      <TimeUsagePanel title={'Test Title'} totalActivityTime={0} />
    </div>
  ),
};

export const Default: Story = {
  render: () => (
    <div className="w-[300px]">
      <TimeUsagePanel
        totalActivityTime={1000 * 60 * 60}
        title={getIsoDate(new Date())}
      />
    </div>
  ),
};

export const DefaultWithAverageComparison: Story = {
  render: () => (
    <div className="w-[300px]">
      <TimeUsagePanel
        totalActivityTime={1000 * 60 * 60}
        title={getIsoDate(new Date())}
        averageTime={1000 * 60 * 60 * 0.8}
      />
    </div>
  ),
  parameters: {
    layout: 'centered',
  },
};
