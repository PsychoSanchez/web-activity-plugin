import { getIsoDate } from '../../shared/utils/dates-helper';

import { usePopupContext } from './PopupContext';

export const useActiveTabTime = () => {
  const { store, activeHostname } = usePopupContext();

  return store?.[getIsoDate(new Date())]?.[activeHostname] ?? 0;
};
