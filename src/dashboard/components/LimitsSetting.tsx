import { CircleX } from 'lucide-react';
import * as React from 'react';

import { Time } from '@shared/blocks/Input';
import { useSettings } from '@shared/hooks/useSettings';
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

export const LimitsSetting = () => {
  const [settings, updateSettings] = useSettings();
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
        setLimit(0);
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

  const handleSubmit = React.useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      handleLimitChange(domainToLimit, limit);
    },
    [domainToLimit, limit, handleLimitChange],
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
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="flex flex-col gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="domain-input"
                  className="text-sm font-medium leading-none"
                >
                  {i18n('LimitsSetting_DomainInputLabel')}
                </label>
                <Input
                  id="domain-input"
                  placeholder="e.g. google.com"
                  value={domainToLimit}
                  onChange={handleLimitDomainChange}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="time-input"
                  className="text-sm font-medium leading-none"
                >
                  {i18n('LimitsSetting_TimeLimitInputLabel')}
                </label>
                <Time
                  id="time-input"
                  onChange={handleLimitTimeChange}
                  className="w-full"
                />
              </div>
            </div>
            <Button type="submit" className="w-full">
              {i18n('LimitsSetting_AddButton')}
            </Button>
          </div>

          {limitsEntries.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">
                {i18n('LimitsSetting_ActiveLimits')}
              </h3>
              <div className="space-y-2">
                {limitsEntries.map(([domain, limit]) => (
                  <div
                    key={domain}
                    className="flex items-center justify-between gap-2 rounded-md border p-2"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <CircleX
                        className="h-4 w-4 shrink-0 cursor-pointer text-muted-foreground hover:text-destructive"
                        onClick={() => handleLimitRemove(domain)}
                      />
                      <span className="truncate">{domain}</span>
                    </div>
                    <span className="shrink-0 font-medium">
                      {Math.floor(limit / 60)}h {limit % 60}m
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};
