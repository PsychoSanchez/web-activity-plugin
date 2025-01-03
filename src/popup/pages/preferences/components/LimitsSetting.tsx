import { CircleX } from 'lucide-react';
import * as React from 'react';

import { Time } from '@shared/blocks/Input';
import { i18n } from '@shared/services/i18n';
import { Button } from '@shared/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@shared/ui/card';
import { Input } from '@shared/ui/input';
import { assertIsValidHostname } from '@shared/utils/url';

import { usePopupContext } from '@popup/hooks/PopupContext';

export const LimitsSetting = () => {
  const { settings, updateSettings } = usePopupContext();
  const [limits, setLimits] = React.useState<Record<string, number>>(
    settings.limits,
  );
  const [domainToLimit, setDomainToLimit] = React.useState<string>('');
  const [limit, setLimit] = React.useState<number>(0);

  const handleLimitChange = React.useCallback(
    (domain: string, limit: number) => {
      try {
        assertIsValidHostname(domain);
        setLimits((prev) => {
          const newLimits = {
            ...prev,
            [domain]: limit,
          };

          updateSettings({
            limits: newLimits,
          });

          return newLimits;
        });

        setDomainToLimit('');
      } catch (_) {
        //
      }
    },
    [setLimits, updateSettings],
  );

  const handleLimitRemove = React.useCallback(
    (domain: string) => {
      setLimits((prev) => {
        const { [domain]: _, ...rest } = prev;

        updateSettings({
          limits: rest,
        });
        return rest;
      });
    },
    [setLimits, updateSettings],
  );

  // Time limit need to be parsed from input type time
  // to minutes (e.g. 01:00 -> 60)
  const handleLimitTimeChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const [hours = '-', minutes = '-'] = e.target.value.split(':');
      setLimit(
        Number(hours.replace(/-/g, '0')) * 60 +
          Number(minutes.replace(/-/g, '0')),
      );
    },
    [setLimit],
  );

  const handleLimitDomainChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setDomainToLimit(e.target.value);
    },
    [setDomainToLimit],
  );

  const limitsEntries = React.useMemo(() => Object.entries(limits), [limits]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{i18n('LimitsSetting_Header')}</CardTitle>
        <CardDescription>
          {i18n('LimitsSetting_FeatureDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <div className="flex justify-between items-end gap-2">
          <label className="flex flex-col gap-1 w-full">
            {i18n('LimitsSetting_DomainInputLabel')}
            <Input
              placeholder="e.g. google.com"
              value={domainToLimit}
              onChange={handleLimitDomainChange}
            />
          </label>
          <label className="flex flex-col gap-1 w-full">
            {i18n('LimitsSetting_TimeLimitInputLabel')}
            <Time onChange={handleLimitTimeChange} />
          </label>
          <Button
            className="h-fit py-2 px-4 border-2 border-solid border-transparent"
            onClick={() => handleLimitChange(domainToLimit, limit)}
          >
            {i18n('LimitsSetting_AddButton')}
          </Button>
        </div>
        {limitsEntries.length > 0 ? (
          <div className="flex flex-col gap-1">
            {limitsEntries.map(([domain, limit]) => (
              <div
                key={domain}
                className="flex justify-between items-center gap-2"
              >
                <CircleX
                  className="hover:text-red-500 cursor-pointer"
                  onClick={() => handleLimitRemove(domain)}
                  size={16}
                />
                <span className="flex-1">{domain}</span>
                {/* Present time limit from number in minutes to 1h 30m */}
                <span>
                  {Math.floor(limit / 60)}h {limit % 60}m
                </span>
              </div>
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};
