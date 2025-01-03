import * as React from 'react';
import { DeepReadonly } from 'utility-types';

import { Preferences } from '@shared/db/types';
import { DEFAULT_PREFERENCES } from '@shared/preferences';

import { getFilteredWebsiteTimeStoreSlice } from '@popup/services/time-store';

import { useActiveTabHostname } from './useActiveTab';
import { useSettings } from './useSettings';
import { TimeStore, useTimeStore } from './useTimeStore';

export type PopupContextType = {
  isStoreLoaded: boolean;
  store: TimeStore;
  activeHostname: string;
  settings: DeepReadonly<Preferences>;
  updateSettings: (updated: Partial<Preferences>) => void;
};

const DEFAULT_CONTEXT: PopupContextType = {
  isStoreLoaded: false,
  store: {},
  activeHostname: '',
  settings: DEFAULT_PREFERENCES,
  updateSettings: () => {},
};

const PopupContext = React.createContext<PopupContextType>(DEFAULT_CONTEXT);

export const usePopupContext = () => React.useContext(PopupContext);

export const PopupContextProvider = ({ children }: React.PropsWithChildren) => {
  const [store, isLoaded] = useTimeStore();
  const host = useActiveTabHostname();
  const [settings, updateSettings] = useSettings();

  const filteredStore = React.useMemo(
    () =>
      getFilteredWebsiteTimeStoreSlice(
        store,
        (_date, host) => !settings.ignoredHosts.includes(host),
      ),
    [store, settings.ignoredHosts],
  );

  return (
    <PopupContext.Provider
      value={{
        isStoreLoaded: isLoaded,
        store: filteredStore,
        activeHostname: host || '',
        settings,
        updateSettings,
      }}
    >
      {children}
    </PopupContext.Provider>
  );
};
