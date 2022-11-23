import { isExtensionContextInvalidatedError } from './background/browser-api/errors';
import { getMinutesInMs } from './shared/utils/dates-helper';
import { ignore } from './shared/utils/errors';

// const BG_SCRIPT = 'background.bundle.js';
// navigator.serviceWorker.getRegistrations().then((res) => {
//   for (let worker of res) {
//     console.log(worker);
//     if (worker.active?.scriptURL.includes(BG_SCRIPT)) {
//       return;
//     }
//   }

//   navigator.serviceWorker
//     .register(chrome.runtime.getURL(BG_SCRIPT))
//     .then((registration) => {
//       console.log('Service worker success:', registration);
//     })
//     .catch((error) => {
//       console.log('Error service:', error);
//     });
// });

function tryWakeUpBackground() {
  try {
    chrome.runtime.sendMessage({ type: 'wake-up' }, (response) => {
      if (!response) {
        console.error('Background is not awake');
      }
    });
  } catch (error) {
    ignore(isExtensionContextInvalidatedError)(error);
  }
}

const connectToExtension = () =>
  chrome.runtime.connect().onDisconnect.addListener(() => {
    setTimeout(() => connectToExtension(), getMinutesInMs(1));
  });

setInterval(() => {
  // if page is on foreground, try to wake up background
  if (document.visibilityState === 'visible') {
    tryWakeUpBackground();
  }
}, getMinutesInMs(2.5));

tryWakeUpBackground();
connectToExtension();
