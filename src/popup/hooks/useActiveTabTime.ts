import { get7DaysPriorDate, getIsoDate } from '@shared/utils/dates-helper';

import { usePopupContext } from './PopupContext';

export const useActiveTabTime = () => {
  const { store, activeHostname } = usePopupContext();

  const time = store?.[getIsoDate(new Date())]?.[activeHostname] ?? 0;
  const weekTime = get7DaysPriorDate(new Date()).reduce((sum, date) => {
    return sum + (store?.[getIsoDate(date)]?.[activeHostname] ?? 0);
  }, 0);

  return { time, weekTime };
};
