import { useMemo } from 'react';

import { get7DaysPriorDate, getIsoDate } from '@shared/utils/dates-helper';

import { usePopupContext } from './PopupContext';

export const useActiveTabTime = () => {
  const { store, activeHostname } = usePopupContext();

  return useMemo(() => {
    const today = new Date();
    const time = store?.[getIsoDate(today)]?.[activeHostname] ?? 0;
    const weekTime = get7DaysPriorDate(today).reduce((sum, date) => {
      return sum + (store?.[getIsoDate(date)]?.[activeHostname] ?? 0);
    }, 0);

    return { time, weekTime };
  }, [store, activeHostname]);
};
