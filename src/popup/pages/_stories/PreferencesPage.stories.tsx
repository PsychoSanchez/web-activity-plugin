import { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { PreferencesPage } from '@popup/pages/preferences/PreferencesPage';

export default {
  title: 'popup/pages/PreferencesPage',
  component: PreferencesPage,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof PreferencesPage>;

type Story = StoryObj<Meta<typeof PreferencesPage>>;

export const Default: Story = {
  render: () => <PreferencesPage />,
  parameters: {
    layout: 'centered',
  },
};
