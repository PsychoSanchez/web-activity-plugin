import * as React from 'react';

import { Preferences } from '@shared/db/types';
import {
  DEFAULT_PREFERENCES,
  getSettings,
  setSettings,
} from '@shared/preferences';

export const useSettings = () => {
  const [settings, setCachedSettings] =
    React.useState<Preferences>(DEFAULT_PREFERENCES);

  React.useEffect(() => {
    (async function () {
      const savedSettings = await getSettings();
      setCachedSettings(savedSettings);
    })();
  }, []);

  const updateSettings = React.useCallback(
    async (updates: Partial<Preferences>) => {
      await setSettings(updates);
      setCachedSettings((set) => ({ ...set, ...updates }));
    },
    [],
  );

  return [settings, updateSettings] as const;
};
