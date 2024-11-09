import { ChartBarDecreasing, CircleX, Globe } from 'lucide-react';
import * as React from 'react';

import { ActivitySummaryByHostname } from '@shared/db/types';
import { i18n } from '@shared/services/i18n';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card';
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
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span className="flex gap-2">
            <ChartBarDecreasing size={16} />
            {title}
          </span>
          <span>{getTimeWithoutSeconds(totalActivity)}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {websiteEntriesSortedDesc.length === 0 ? (
          <span className="dark:text-neutral-300">
            {i18n('ActivityTable_NoDataAvailable')}
          </span>
        ) : null}

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
                  <Globe
                    className="w-4 m-0 scale-105 translate-x-[1px] flex items-center"
                    size={16}
                  />
                )}
                {domain}
              </a>
              <span className="min-w-[90px] text-right">
                {getTimeFromMs(time)}
              </span>
              <CircleX
                size={16}
                className="hover:text-red-500 cursor-pointer flex items-center"
                onClick={() => handleHideDomainClick(domain)}
              />
            </div>
          );
        })}
        <div className="pt-2">
          <p className="dark:text-neutral-300">
            {i18n('ActivityTable_ClickToFilterHint')}
          </p>
          <p className="dark:text-neutral-300">
            {i18n('ActivityTable_ClickToIgnoreHintPart1')}{' '}
            <CircleX className="m-0" size={16} />{' '}
            {i18n('ActivityTable_ClickToIgnoreHintPart2')}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
