import type { Meta, StoryObj } from '@storybook/react';

import { Input } from '../Input';

const meta: Meta<typeof Input> = {
  title: 'Block/Input',
  component: Input,
  argTypes: {
    className: { control: 'text' },
    placeholder: { control: 'text' },
    value: { control: 'text' },
    onChange: { action: 'changed' },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
};

export const WithValue: Story = {
  args: {
    value: 'Initial value',
  },
};

export const CustomClass: Story = {
  args: {
    className: 'custom-class',
    placeholder: 'Custom class input',
  },
};
