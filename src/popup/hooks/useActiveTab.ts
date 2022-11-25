import * as React from 'react';

import { getFocusedTab } from '../../background/browser-api/tabs';
import { getIsoDate } from '../../shared/utils/dates-helper';

export const useActiveTabHostname = () => {
  const [host, setHost] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function getActiveHostInfo() {
      const tab = await getFocusedTab();

      if (tab?.url) {
        const today = getIsoDate(new Date());
        const host = new URL(tab.url).host;

        setHost(host);
      }
    }

    getActiveHostInfo();
  }, []);

  return host;
};
