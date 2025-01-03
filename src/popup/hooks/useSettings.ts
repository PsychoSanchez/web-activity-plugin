import * as React from 'react';
import { DeepReadonly } from 'utility-types';

import { Preferences } from '@shared/db/types';
import {
  DEFAULT_PREFERENCES,
  getSettings,
  setSettings,
} from '@shared/preferences';

export const useSettings = () => {
  const [settings, setCachedSettings] =
    React.useState<DeepReadonly<Preferences>>(DEFAULT_PREFERENCES);

  React.useEffect(() => {
    getSettings().then(setCachedSettings);
  }, []);

  const updateSettings = React.useCallback(
    async (updates: Partial<Preferences>) => {
      await setSettings(updates);
      setCachedSettings((prev) => ({ ...prev, ...updates }));
    },
    [],
  );

  return [settings, updateSettings] as const;
};
