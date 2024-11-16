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
    <div className="min-w-[600px] relative">
      <div className="min-w-[600px] min-h-[1000px] bg-red-600"></div>
      <AppLoadingSkeleton className="absolute top-0 bg-background" isVisible />
    </div>
  ),
  parameters: {
    layout: 'centered',
  },
};
