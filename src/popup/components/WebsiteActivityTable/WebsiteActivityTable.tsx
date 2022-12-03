import * as React from 'react';

import { Icon, IconType } from '../../../blocks/Icon';
import { Panel, PanelBody, PanelHeader } from '../../../blocks/Panel';
import {
  getTimeFromMs,
  getTimeWithoutSeconds,
} from '../../../shared/utils/dates-helper';
import { usePopupContext } from '../../hooks/PopupContext';

import { ActivityTableProps } from './types';

const DEFAULT_TITLE = 'Websites This Day';

const WebsiteActivityTableFC: React.FC<ActivityTableProps> = ({
  websiteTimeMap: activity,
  title = DEFAULT_TITLE,
  onDomainRowClicked,
}) => {
  const { settings, updateSettings } = usePopupContext();
  const totalActivity = React.useMemo(
    () => Object.values(activity ?? {}).reduce((acc, val) => acc + val, 0) || 0,
    [activity]
  );

  const websiteSortedDesc = React.useMemo(
    () =>
      Object.entries(activity ?? {}).sort(
        ([, timeA], [, timeB]) => timeB - timeA
      ),
    [activity]
  );

  const handleDomainRowClick = React.useCallback(
    (domain: string) => onDomainRowClicked?.(domain),
    [onDomainRowClicked]
  );

  const handleHideDomainClick = React.useCallback(
    (domain: string) => {
      updateSettings({
        ignoredHosts: Array.from(new Set([...settings.ignoredHosts, domain])),
      });
    },
    [settings.ignoredHosts, updateSettings]
  );

  return (
    <Panel>
      <PanelHeader className="flex justify-between pb-2">
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
              <Icon
                type={IconType.Close}
                className="hover:text-neutral-400 cursor-pointer"
                onClick={() => handleHideDomainClick(domain)}
              />
              <a
                className="flex-1 no-underline text-ellipsis overflow-hidden cursor-pointer hover:text-neutral-500"
                title={domain}
                onClick={() => handleDomainRowClick(domain)}
              >
                {domain}
              </a>
              <span className="min-w-[90px] text-right">
                {getTimeFromMs(time)}
              </span>
            </div>
          );
        })}
        <div>
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
  WebsiteActivityTableFC
);
