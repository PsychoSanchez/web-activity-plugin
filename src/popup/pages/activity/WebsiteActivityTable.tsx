import * as React from 'react';

import { Icon, IconType } from '@shared/blocks/Icon';
import { Panel, PanelBody, PanelHeader } from '@shared/blocks/Panel';
import { selectHostnames } from '@shared/tables/domain-info';
import {
  getTimeFromMs,
  getTimeWithoutSeconds,
} from '@shared/utils/dates-helper';

import { usePopupContext } from '../../hooks/PopupContext';

type Domain = string;
type Time = number;

export interface ActivityTableProps {
  websiteTimeMap: Record<Domain, Time>;
  title?: string;
  onDomainRowClicked?: (domain: string) => void;
  onFilterButtonClicked?: (domain: string) => void;
  onUndoFilterButtonClicked?: (domain: string) => void;
}

const DEFAULT_TITLE = 'Websites This Day';

const WebsiteActivityTableFC: React.FC<ActivityTableProps> = ({
  websiteTimeMap: activity,
  title = DEFAULT_TITLE,
  onDomainRowClicked,
}) => {
  const { settings, updateSettings } = usePopupContext();
  const totalActivity = React.useMemo(
    () => Object.values(activity ?? {}).reduce((acc, val) => acc + val, 0) || 0,
    [activity],
  );

  const websiteSortedDesc = React.useMemo(
    () =>
      Object.entries(activity ?? {}).sort(
        ([, timeA], [, timeB]) => timeB - timeA,
      ),
    [activity],
  );

  const [domainFavIconMap, setDomainFavIconMap] = React.useState<
    Record<string, string>
  >({});

  React.useEffect(() => {
    selectHostnames(websiteSortedDesc.map(([domain]) => domain)).then(
      (domainInfo) => {
        setDomainFavIconMap(
          domainInfo.reduce(
            (acc, { hostname, iconUrl }) => {
              acc[hostname] = iconUrl;
              return acc;
            },
            {} as Record<string, string>,
          ),
        );
      },
    );
  }, [websiteSortedDesc]);

  const handleDomainRowClick = React.useCallback(
    (domain: string) => onDomainRowClicked?.(domain),
    [onDomainRowClicked],
  );

  const handleHideDomainClick = React.useCallback(
    (domain: string) => {
      updateSettings({
        ignoredHosts: Array.from(new Set([...settings.ignoredHosts, domain])),
      });
    },
    [settings.ignoredHosts, updateSettings],
  );

  return (
    <Panel>
      <PanelHeader className="flex justify-between pb-4">
        <span>
          <Icon type={IconType.CalendarLinesPen} />
          {title}
        </span>
        <span>{getTimeWithoutSeconds(totalActivity)}</span>
      </PanelHeader>
      <PanelBody className="flex flex-col gap-2">
        {websiteSortedDesc.map(([domain, time]) => {
          return (
            <div
              className="flex gap-2 justify-between items-center text-sm px-1 last:pb-0 border-1 border-solid border-neutral-500"
              key={domain}
            >
              <a
                className="flex flex-row items-center gap-2 flex-1 no-underline text-ellipsis overflow-hidden cursor-pointer hover:text-neutral-500"
                title={domain}
                onClick={() => handleDomainRowClick(domain)}
              >
                {domainFavIconMap[domain] ? (
                  <img
                    className="w-4 h-4"
                    src={domainFavIconMap[domain]}
                    alt={domain + ' icon'}
                  />
                ) : (
                  <Icon
                    className="w-4 m-0 scale-105 translate-x-[1px]"
                    type={IconType.Globe}
                  />
                )}
                {domain}
              </a>
              <span className="min-w-[90px] text-right">
                {getTimeFromMs(time)}
              </span>
              <Icon
                type={IconType.Close}
                className="hover:text-red-500 cursor-pointer"
                onClick={() => handleHideDomainClick(domain)}
              />
            </div>
          );
        })}
        <div className="pt-2">
          <p className="dark:text-neutral-300">
            Click on the website name to view stats for this website.
          </p>
          <p className="dark:text-neutral-300">
            Click on the <Icon className="m-0" type={IconType.Close} /> icon to
            hide and ignore this website. You can always unhide it in the
            Ignored domains section.
          </p>
        </div>
      </PanelBody>
    </Panel>
  );
};

export const WebsiteActivityTable: React.FC<ActivityTableProps> = React.memo(
  WebsiteActivityTableFC,
);
