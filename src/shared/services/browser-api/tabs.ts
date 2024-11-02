import { throwRuntimeLastError } from './errors';
import { getFocusedWindowId } from './windows';

export const getFocusedTab = async () => {
  const windowId = await getFocusedWindowId();
  const tabs = await chrome.tabs.query({
    windowId,
  });
  throwRuntimeLastError();

  return (
    tabs.filter((tab) => tab.active)[0] ??
    tabs.filter((tab) => tab.highlighted)[0]
  );
};
