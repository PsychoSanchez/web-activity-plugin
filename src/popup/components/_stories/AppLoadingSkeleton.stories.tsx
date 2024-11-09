import { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { AppLoadingSkeleton } from '../AppLoadingSkeleton';

export default {
  title: 'popup/components/AppLoadingSkeleton',
  component: AppLoadingSkeleton,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof AppLoadingSkeleton>;

type Story = StoryObj<Meta<typeof AppLoadingSkeleton>>;

export const Default: Story = {
  render: () => (
    <div className="min-w-[600px]">
      <AppLoadingSkeleton />
    </div>
  ),
  parameters: {
    layout: 'centered',
  },
};
