import { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { ActivityPage } from '@popup/pages/activity/ActivityPage';

export default {
  title: 'popup/pages/ActivityPage',
  component: ActivityPage,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof ActivityPage>;

type Story = StoryObj<Meta<typeof ActivityPage>>;

export const Default: Story = {
  render: () => <ActivityPage />,
  parameters: {
    layout: 'centered',
  },
};
