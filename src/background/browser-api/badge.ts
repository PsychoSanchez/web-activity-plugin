import { browser } from 'webextension-polyfill-ts';

export const setActionBadge = async ({
  tabId,
  text,
  color = '#4b76e3',
}: {
  tabId: number;
  text: string;
  color: string;
}) => {
  await Promise.all([
    chromeActionSetBadgeColor(tabId, color),
    chromeActionSetBadgeText(tabId, text),
    browser.browserAction?.setBadgeBackgroundColor?.({ color: '#4b76e3' }),
    browser.browserAction?.setBadgeText?.({
      tabId,
      text,
    }),
  ]);
};

export const hideBadge = async (tabId: number) => {
  await browser.browserAction.setBadgeText({
    tabId,
    text: '',
  });
};

function chromeActionSetBadgeColor(tabId: number, color: string) {
  return new Promise<void>((resolve) =>
    chrome.action?.setBadgeBackgroundColor
      ? chrome.action.setBadgeBackgroundColor({ color, tabId }, resolve)
      : resolve()
  );
}

function chromeActionSetBadgeText(tabId: number, text: string) {
  return new Promise<void>((resolve) =>
    chrome.action?.setBadgeText
      ? chrome.action.setBadgeText({ text, tabId }, resolve)
      : resolve()
  );
}
