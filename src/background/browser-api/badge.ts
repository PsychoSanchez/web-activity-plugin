import { ignore } from '@shared/utils/errors';

import { isTabNotExistError } from './errors';

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
  ]).catch(ignore(isTabNotExistError));
};

export const hideBadge = async (tabId: number) => {
  await Promise.all([chromeActionSetBadgeText(tabId, '')]).catch(
    ignore(isTabNotExistError),
  );
};

function chromeActionSetBadgeColor(tabId: number, color: string) {
  return new Promise<void>((resolve) =>
    chrome.action?.setBadgeBackgroundColor
      ? chrome.action.setBadgeBackgroundColor({ color, tabId }, resolve)
      : resolve(),
  );
}

function chromeActionSetBadgeText(tabId: number, text: string) {
  return new Promise<void>((resolve) =>
    chrome.action?.setBadgeText
      ? chrome.action.setBadgeText({ text, tabId }, resolve)
      : resolve(),
  );
}
