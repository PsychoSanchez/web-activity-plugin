import { LIMIT_EXCEEDED, LIMIT_OK } from '@shared/messages';

import { greyOutBody, unGreyOutBody } from './content/limits';
import { runManifestV3SleepCounterMeasures } from './content/sleep-counter-measures';

runManifestV3SleepCounterMeasures();

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === LIMIT_EXCEEDED) {
    greyOutBody();
  } else if (message.type === LIMIT_OK) {
    unGreyOutBody();
  }
});
