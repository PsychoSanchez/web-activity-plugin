import * as React from 'react';

export type PopupContextType = {
  activity: Record<string, Record<string, number>>;
  isLoading: boolean;
};

const DEFAULT_CONTEXT: PopupContextType = {
  activity: {},
  isLoading: true,
};

export const PopupContext =
  React.createContext<PopupContextType>(DEFAULT_CONTEXT);
