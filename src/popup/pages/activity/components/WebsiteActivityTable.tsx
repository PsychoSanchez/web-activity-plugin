import * as React from 'react';

import { ActivitySummaryByHostname } from '@shared/db/types';
import { selectHostnames } from '@shared/tables/domain-info';

import { ActivityTable } from '@popup/components/ActivityTable';
import { usePopupContext } from '@popup/hooks/PopupContext';

export interface ActivityTableProps {
  websiteTimeMap: ActivitySummaryByHostname;
  title: string;
  onDomainRowClicked?: (domain: string) => void;
  onFilterDomainButtonClicked?: (domain: string) => void;
  onUndoFilterDomainButtonClicked?: (domain: string) => void;
}

export const WebsiteActivityTable: React.FC<ActivityTableProps> = React.memo(
  ({ websiteTimeMap: activity, title, onDomainRowClicked }) => {
    const { settings, updateSettings } = usePopupContext();

    const [domainFavIconMap, setDomainFavIconMap] = React.useState<
      Map<string, string>
    >(() => new Map());

    const handleHideDomainClick = React.useCallback(
      (domain: string) => {
        updateSettings({
          ignoredHosts: Array.from(new Set([...settings.ignoredHosts, domain])),
        });
      },
      [settings.ignoredHosts, updateSettings],
    );

    React.useEffect(() => {
      selectHostnames(Object.keys(activity).map((domain) => domain)).then(
        (domainInfo) => {
          setDomainFavIconMap(
            new Map(
              domainInfo.map(({ hostname, iconUrl }) => [hostname, iconUrl]),
            ),
          );
        },
      );
    }, [activity]);

    return (
      <ActivityTable
        faviconMap={domainFavIconMap}
        activity={activity}
        title={title}
        onDomainRowClicked={onDomainRowClicked}
        onFilterDomainButtonClicked={handleHideDomainClick}
      />
    );
  },
);
