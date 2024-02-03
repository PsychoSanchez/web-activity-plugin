import { WAKE_UP_BACKGROUND } from '@shared/messages';
import { getMinutesInMs } from '@shared/utils/dates-helper';
import { ignore } from '@shared/utils/errors';

import {
  isCouldNotEstablishConnectionError,
  isExtensionContextInvalidatedError,
  throwRuntimeLastError,
} from '../background/browser-api/errors';

let messagePollingId = 0;

function tryWakeUpBackground() {
  chrome.runtime.sendMessage({ type: WAKE_UP_BACKGROUND }, (response) => {
    if (!response) {
      console.error('Background is not awake');
    }

    try {
      throwRuntimeLastError();
    } catch (error) {
      ignore(
        isExtensionContextInvalidatedError,
        isCouldNotEstablishConnectionError,
      )(error);
    }

    // Continue polling only if the background is not invalidated and visible
    if (document.visibilityState === 'visible') {
      messagePollingId = window.setTimeout(
        () => tryWakeUpBackground(),
        getMinutesInMs(1),
      );
    }
  });
}

function connectToExtension() {
  chrome.runtime.connect().onDisconnect.addListener(() => {
    try {
      throwRuntimeLastError();
    } catch (error) {
      ignore(
        isExtensionContextInvalidatedError,
        isCouldNotEstablishConnectionError,
      )(error);
    }
    setTimeout(() => connectToExtension(), getMinutesInMs(1));
  });
}

export const runManifestV3SleepCounterMeasures = () => {
  tryWakeUpBackground();
  connectToExtension();

  // if page is on foreground, try to wake up background
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      window.clearTimeout(messagePollingId);
      tryWakeUpBackground();
    }
  });
};
