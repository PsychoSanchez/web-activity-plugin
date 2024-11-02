import type { Meta, StoryObj } from '@storybook/react';

import { Icon, IconProps, IconType } from '../Icon';

const meta: Meta<IconProps> = {
  title: 'Block/Icon',
  component: Icon,
  argTypes: {
    type: {
      options: Object.values(IconType),
      mapping: IconType,
      control: {
        type: 'select',
      },
    },
    className: { control: 'text' },
    onClick: { action: 'clicked' },
  },
};

export default meta;
type Story = StoryObj<IconProps>;

export const Default: Story = {
  args: {
    type: IconType.TimeCheck,
    className: '',
  },
};

export const WithCustomClass: Story = {
  args: {
    type: IconType.TimeCheck,
    className: 'custom-class',
  },
};

export const Clickable: Story = {
  args: {
    type: IconType.TimeCheck,
    onClick: () => alert('Icon clicked!'),
  },
};
