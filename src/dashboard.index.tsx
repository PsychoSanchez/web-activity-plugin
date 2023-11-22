import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { PopupApp } from './popup/App';
import { initTheme } from './popup/hooks/useTheme';
import { WAKE_UP_BACKGROUND } from './shared/messages';

initTheme();

ReactDOM.render(<PopupApp />, document.querySelector('#app'));

function tryWakeUpBackground() {
  chrome.runtime.sendMessage({ type: WAKE_UP_BACKGROUND }, (response) => {
    if (!response) {
      chrome.runtime.reload();
    }
  });
}

tryWakeUpBackground();
