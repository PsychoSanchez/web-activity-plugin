import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { WAKE_UP_BACKGROUND } from '@shared/messages';

import { PopupApp } from './popup/App';
import { initTheme } from './popup/hooks/useTheme';

initTheme();

// eslint-disable-next-line react/no-deprecated
ReactDOM.render(<PopupApp />, document.querySelector('#app'));

function tryWakeUpBackground() {
  chrome.runtime.sendMessage({ type: WAKE_UP_BACKGROUND }, (response) => {
    if (!response) {
      chrome.runtime.reload();
    }
  });
}

tryWakeUpBackground();
