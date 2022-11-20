import * as React from 'react';

import { getFocusedTab } from '../../background/browser-api/tabs';
import { getIsoDate } from '../../shared/utils/dates-helper';

import { AppStore } from './useTimeStore';

export const useActiveTabTime = (
  store: AppStore
):
  | {
      time: number;
      host: string;
    }
  | {
      time: null;
      host: null;
    } => {
  const [time, setTime] = React.useState<number | null>(null);
  const [host, setHost] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function getActiveHostInfo() {
      const tab = await getFocusedTab();

      if (tab?.url) {
        const today = getIsoDate(new Date());
        const host = new URL(tab.url).host;
        const usage = store[today]?.[host] ?? null;

        setHost(host);
        setTime(usage);
      }
    }

    getActiveHostInfo();
  }, [store]);

  return { time, host } as any;
};
