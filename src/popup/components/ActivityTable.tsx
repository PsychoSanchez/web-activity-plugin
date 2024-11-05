import * as React from 'react';

import { Icon, IconType } from '@shared/blocks/Icon';
import { Panel, PanelBody, PanelHeader } from '@shared/blocks/Panel';
import { ActivitySummaryByHostname } from '@shared/db/types';
import { getTimeFromMs, getTimeWithoutSeconds } from '@shared/utils/date';

import {
  ActivitySummaryByDate,
  calculateTotalActivity,
} from '@popup/services/time-store';

export interface ActivityTableProps {
  activity: ActivitySummaryByHostname | ActivitySummaryByDate;
  title: string;
  faviconMap?: Map<string, string>;
  onDomainRowClicked?: (domain: string) => void;
  onFilterDomainButtonClicked?: (domain: string) => void;
  onUndoFilterDomainButtonClicked?: (domain: string) => void;
}

export const ActivityTable: React.FC<ActivityTableProps> = ({
  activity,
  title,
  faviconMap = new Map(),
  onDomainRowClicked,
  onFilterDomainButtonClicked,
}) => {
  const totalActivity = React.useMemo(
    () => calculateTotalActivity(activity),
    [activity],
  );

  const websiteEntriesSortedDesc = React.useMemo(
    () =>
      Object.entries(activity).sort(([, timeA], [, timeB]) => timeB - timeA),
    [activity],
  );

  const handleDomainRowClick = React.useCallback(
    (domain: string) => onDomainRowClicked?.(domain),
    [onDomainRowClicked],
  );

  const handleHideDomainClick = React.useCallback(
    (domain: string) => {
      onFilterDomainButtonClicked?.(domain);
    },
    [onFilterDomainButtonClicked],
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
        {websiteEntriesSortedDesc.map(([domain, time]) => {
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
                {faviconMap.has(domain) ? (
                  <img
                    className="w-4 h-4"
                    src={faviconMap.get(domain)}
                    alt={domain + ' icon'}
                  />
                ) : (
                  <Icon
                    className="w-4 m-0 scale-105 translate-x-[1px] flex items-center"
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
                className="hover:text-red-500 cursor-pointer flex items-center"
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
