import * as React from 'react';

import { useActiveTabHostname } from './useActiveTab';
import { TimeStore, useTimeStore } from './useTimeStore';

export type PopupContextType = {
  store: TimeStore;
  activeHostname: string;
};

const DEFAULT_CONTEXT: PopupContextType = {
  store: {},
  activeHostname: '',
};

export const PopupContext =
  React.createContext<PopupContextType>(DEFAULT_CONTEXT);

export const usePopupContext = () => React.useContext(PopupContext);

export const PopupContextProvider: React.FC<{}> = ({ children }) => {
  const store = useTimeStore();
  const host = useActiveTabHostname();

  return (
    <PopupContext.Provider value={{ store, activeHostname: host || '' }}>
      {children}
    </PopupContext.Provider>
  );
};
