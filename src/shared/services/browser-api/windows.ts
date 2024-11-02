export const getFocusedWindowId = async () => {
  const windows = await chrome.windows.getAll();

  return (
    windows.find((window) => window.focused)?.id ||
    chrome.windows.WINDOW_ID_NONE
  );
};
