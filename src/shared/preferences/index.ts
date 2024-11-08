import { DeepReadonly } from 'utility-types';

import { Preferences } from '@shared/db/types';

export const DEFAULT_PREFERENCES: DeepReadonly<Preferences> = {
  ignoredHosts: [],
  limits: {},
  displayTimeOnBadge: true,
};

export const setSettings = async (
  settings: Partial<DeepReadonly<Preferences>>,
) => {
  const currentSettings = await getSettings();

  await chrome.storage.local.set({
    settings: { ...currentSettings, ...settings },
  });
};

export const getSettings = async (): Promise<DeepReadonly<Preferences>> => {
  const { settings = {} } = await chrome.storage.local.get('settings');
  return {
    ...DEFAULT_PREFERENCES,
    ...settings,
  };
};
