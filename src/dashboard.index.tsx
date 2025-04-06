import * as React from 'react';
import { createRoot } from 'react-dom/client';

import { WAKE_UP_BACKGROUND } from '@shared/messages';
import { assert } from '@shared/utils/guards';

import { App } from './dashboard/App';
import { initTheme } from './popup/hooks/useTheme';

initTheme();

const appNode = document.querySelector('#app');
assert(appNode, 'Could not find #app element');
const root = createRoot(appNode);
root.render(<App />);

function tryWakeUpBackground() {
  chrome.runtime.sendMessage({ type: WAKE_UP_BACKGROUND }, (response) => {
    if (!response) {
      chrome.runtime.reload();
    }
  });
}

tryWakeUpBackground();
