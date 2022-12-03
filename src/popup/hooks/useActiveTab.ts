import * as React from 'react';

import { getFocusedTab } from '../../background/browser-api/tabs';

export const useActiveTabHostname = () => {
  const [host, setHost] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function getActiveHostInfo() {
      const tab = await getFocusedTab();

      if (tab?.url) {
        const host = new URL(tab.url).host;

        setHost(host);
      }
    }

    getActiveHostInfo();
  }, []);

  return host;
};
