import { browser } from 'webextension-polyfill-ts';

import { Preferences } from '../db/types';

export const DEFAULT_PREFERENCES: Preferences = {
  ignoredHosts: [],
  limits: {},
  displayTimeOnBadge: true,
};

export const setSettings = async (settings: Partial<Preferences>) => {
  const currentSettings = await getSettings();

  await browser.storage.local.set({
    settings: { ...currentSettings, ...settings },
  });
};

export const getSettings = async () => {
  const { settings = {} } = await browser.storage.local.get('settings');
  return {
    ...DEFAULT_PREFERENCES,
    ...settings,
  } as Preferences;
};
