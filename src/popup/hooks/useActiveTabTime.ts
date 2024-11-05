import { useMemo } from 'react';

import { generatePrior7DaysDates, getIsoDate } from '@shared/utils/date';

import { usePopupContext } from './PopupContext';

export const useActiveTabTime = () => {
  const { store, activeHostname } = usePopupContext();

  return useMemo(() => {
    const today = new Date();
    // @ts-expect-error -- Fix hostname types
    const time = store?.[getIsoDate(today)]?.[activeHostname] ?? 0;
    const weekTime = generatePrior7DaysDates(today).reduce((sum, date) => {
      // @ts-expect-error -- Fix hostname types
      return sum + (store?.[getIsoDate(date)]?.[activeHostname] ?? 0);
    }, 0);

    return { time, weekTime };
  }, [store, activeHostname]);
};
