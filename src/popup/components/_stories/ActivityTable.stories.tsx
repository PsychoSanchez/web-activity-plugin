import { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { ActivitySummaryByHostname } from '@shared/db/types';

import { ActivityTable } from '../ActivityTable';

export default {
  title: 'Popup/components/ActivityTable',
  component: ActivityTable,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof ActivityTable>;

type Story = StoryObj<Meta<typeof ActivityTable>>;

export const Default: Story = {
  render: () => (
    <ActivityTable
      onDomainRowClicked={(hostname) => alert(`Clicked ${hostname}`)}
      onFilterDomainButtonClicked={(hostname) => alert(`Filter ${hostname}`)}
      activity={
        {
          'example.com': 120000,
          'example.org': 45000,
          'example.net': 30000,
          'example.a': 30000,
          'example.v': 30000,
          'example.c': 30000,
        } as unknown as ActivitySummaryByHostname
      }
      title="Custom Title"
    />
  ),
  parameters: {
    layout: 'centered',
  },
};
