import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';

import { Panel, PanelHeader, PanelBody } from '../Panel';

const meta: Meta = {
  title: 'Block/Panel',
  component: Panel,
  subcomponents: { PanelHeader, PanelBody },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Panel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Panel>
      <PanelHeader>Panel Header</PanelHeader>
      <PanelBody>Panel Body</PanelBody>
    </Panel>
  ),
};

export const WithCustomClass: Story = {
  render: () => (
    <Panel className="custom-class">
      <PanelHeader className="custom-header">Custom Header</PanelHeader>
      <PanelBody className="custom-body">Custom Body</PanelBody>
    </Panel>
  ),
};
