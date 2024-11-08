import { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { OverallPage } from '@popup/pages/overall/OverallPage';

export default {
  title: 'popup/pages/OverallPage',
  component: OverallPage,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof OverallPage>;

type Story = StoryObj<Meta<typeof OverallPage>>;

export const Default: Story = {
  render: () => (
    <OverallPage
      onNavigateToActivityPage={(date) => alert(`Navigate to ${date}`)}
    />
  ),
  parameters: {
    layout: 'centered',
  },
};
