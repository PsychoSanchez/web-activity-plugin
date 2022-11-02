import * as React from 'react';

import { Icon, IconType } from '../../blocks/Icon';
import { Panel, PanelBody, PanelHeader } from '../../blocks/Panel';
import {
  getTimeFromMs,
  getTimeWithoutSeconds,
} from '../../shared/dates-helper';

import { ActivityTableProps } from './types';

const DEFAULT_TITLE = 'Websites This Day';

export const WebsiteActivityTable: React.FC<ActivityTableProps> = React.memo(
  ({ websiteTimeMap: activity, title = DEFAULT_TITLE, onDomainRowClicked }) => {
    const totalActivity = React.useMemo(
      () =>
        Object.values(activity ?? {}).reduce((acc, val) => acc + val, 0) || 0,
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

    return (
      <Panel>
        <PanelHeader className="flex justify-between pb-2">
          <span>
            <Icon type={IconType.CalendarLinesPen} />
            {title}
          </span>
          <span>{getTimeWithoutSeconds(totalActivity)}</span>
        </PanelHeader>
        <PanelBody>
          {websiteSortedDesc.map(([domain, time]) => {
            return (
              <div
                className="flex justify-between text-sm px-1 last:pb-0 border-1 border-solid border-neutral-500"
                key={domain}
              >
                <a
                  className="flex-1 py-1 no-underline text-ellipsis overflow-hidden cursor-pointer hover:text-neutral-500"
                  title={domain}
                  onClick={() => handleDomainRowClick(domain)}
                >
                  {domain}
                </a>
                {/* <button
                  title="Hide this website"
                >
                  -
                </button> */}
                <span className="min-w-[90px] text-right">
                  {getTimeFromMs(time)}
                </span>
              </div>
            );
          })}
        </PanelBody>
      </Panel>
    );
  }
);
