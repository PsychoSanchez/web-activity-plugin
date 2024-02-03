import { Tab } from '@shared/browser-api.types';
import { upsertDomainInfo } from '@shared/tables/domain-info';
import { getHostNameFromUrl } from '@shared/utils/url';

export const updateDomainInfo = async (focusedActiveTab: Tab | null) => {
  if (
    !focusedActiveTab?.id ||
    !focusedActiveTab.url ||
    focusedActiveTab?.status !== 'complete'
  ) {
    return;
  }

  const hostname = getHostNameFromUrl(focusedActiveTab.url);

  await upsertDomainInfo(hostname, {
    hostname,
    iconUrl: focusedActiveTab.favIconUrl ?? '',
  });
};
