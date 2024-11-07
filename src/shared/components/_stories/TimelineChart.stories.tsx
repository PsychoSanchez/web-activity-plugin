import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';

import { TimelineRecord } from '@shared/db/types';

import { TimelineChart } from '../TimelineChart';

const meta: Meta<typeof TimelineChart> = {
  title: 'Components/TimelineChart',
  component: TimelineChart,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof TimelineChart>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleTimelineEvents: TimelineRecord[] = [
  {
    tabId: 1,
    url: 'https://example.com',
    hostname: 'example.com',
    docTitle: 'Example Domain',
    date: '2023-10-01',
    activityPeriodStart: new Date('2023-10-01T10:00:00').getTime(),
    activityPeriodEnd: new Date('2023-10-01T10:30:00').getTime(),
  },
  {
    tabId: 2,
    url: 'https://another-example.com',
    hostname: 'another-example.com',
    docTitle: 'Another Example Domain',
    date: '2023-10-01',
    activityPeriodStart: new Date('2023-10-01T11:00:00').getTime(),
    activityPeriodEnd: new Date('2023-10-01T11:45:00').getTime(),
  },
];

export const Default: Story = {
  render: () => <TimelineChart timelineEvents={sampleTimelineEvents} />,
};

export const DarkTheme: Story = {
  parameters: {
    backgrounds: { default: 'dark' },
  },
  render: () => (
    <TimelineChart timelineEvents={sampleTimelineEvents} isDarkMode />
  ),
};

export const EmptyTimeline: Story = {
  render: () => <TimelineChart timelineEvents={[]} />,
};
