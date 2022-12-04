import {
  isCouldNotEstablishConnectionError,
  isExtensionContextInvalidatedError,
} from '../background/browser-api/errors';
import { WAKE_UP_BACKGROUND } from '../shared/messages';
import { getMinutesInMs } from '../shared/utils/dates-helper';
import { ignore, throwIfNot } from '../shared/utils/errors';

let messagePollingId = 0;

function tryWakeUpBackground() {
  try {
    chrome.runtime.sendMessage({ type: WAKE_UP_BACKGROUND }, (response) => {
      if (!response) {
        console.error('Background is not awake');
      }

      const error = chrome.runtime.lastError;
      if (error?.message) {
        throwIfNot(isCouldNotEstablishConnectionError)(error);
      }
    });

    // Continue polling only if the background is not invalidated and visible
    if (document.visibilityState === 'visible') {
      messagePollingId = window.setTimeout(
        () => tryWakeUpBackground(),
        getMinutesInMs(1)
      );
    }
  } catch (error) {
    ignore(
      isExtensionContextInvalidatedError,
      isCouldNotEstablishConnectionError
    )(error);
  }
}

function connectToExtension() {
  try {
    chrome.runtime.connect().onDisconnect.addListener(() => {
      setTimeout(() => connectToExtension(), getMinutesInMs(1));
    });
  } catch (error) {
    ignore(
      isExtensionContextInvalidatedError,
      isCouldNotEstablishConnectionError
    )(error);
  }
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
