import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { PopupApp } from './popup/App';
import { initTheme } from './popup/hooks/useTheme';

initTheme();

ReactDOM.render(<PopupApp />, document.querySelector('#app'));

function tryWakeUpBackground() {
  chrome.runtime.sendMessage({ type: 'wake-up' }, (response) => {
    if (!response) {
      chrome.runtime.reload();
    }
  });
}

tryWakeUpBackground();
