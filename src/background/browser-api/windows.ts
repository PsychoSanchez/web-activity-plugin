import { browser } from 'webextension-polyfill-ts';

export const getFocusedWindowId = async () => {
  const windows = await browser.windows.getAll();

  return (
    windows.find((window) => window.focused)?.id ||
    chrome.windows.WINDOW_ID_NONE
  );
};
