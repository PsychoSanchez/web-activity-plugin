import type { Meta, StoryObj } from '@storybook/react';

import { Button, ButtonProps, ButtonType } from '../Button';

const meta: Meta<ButtonProps> = {
  title: 'Block/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    buttonType: {
      options: Object.values(ButtonType), // Ensure options match the ButtonType enum
      mapping: ButtonType,
      control: {
        type: 'select',
      },
    },
    className: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<ButtonProps>;

export const Primary: Story = {
  args: {
    buttonType: ButtonType.Primary,
    children: 'Primary Button',
  },
};

export const Secondary: Story = {
  args: {
    buttonType: ButtonType.Secondary,
    children: 'Secondary Button',
  },
};

export const CustomClass: Story = {
  args: {
    className: 'custom-class',
    children: 'Button with Custom Class',
  },
};
