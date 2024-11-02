import * as React from 'react';

import { getFocusedTab } from '@shared/services/browser-api/tabs';

export const useActiveTabHostname = () => {
  const [host, setHost] = React.useState<string | null>(null);

  React.useEffect(() => {
    getFocusedTab().then((tab) => {
      if (tab?.url) {
        const host = new URL(tab.url).host;

        setHost(host);
      }
    });
  }, []);

  return host;
};
