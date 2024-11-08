import { isTabNotExistError } from '@shared/services/browser-api/errors';
import { ignore } from '@shared/utils/errors';

export const setActionBadge = async ({
  tabId,
  text,
  color,
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
