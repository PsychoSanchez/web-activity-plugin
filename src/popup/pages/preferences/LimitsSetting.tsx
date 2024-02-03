import * as React from 'react';

import { Button, ButtonType } from '@shared/blocks/Button';
import { Icon, IconType } from '@shared/blocks/Icon';
import { Input, Time } from '@shared/blocks/Input';
import { Panel, PanelBody, PanelHeader } from '@shared/blocks/Panel';
import { assertDomainIsValid } from '@shared/utils/domains';

import { usePopupContext } from '../../hooks/PopupContext';

export const LimitsSetting: React.FC = () => {
  const { settings, updateSettings } = usePopupContext();
  const [limits, setLimits] = React.useState<Record<string, number>>(
    settings.limits,
  );
  const [domainToLimit, setDomainToLimit] = React.useState<string>('');
  const [limit, setLimit] = React.useState<number>(0);

  const handleLimitChange = React.useCallback(
    (domain: string, limit: number) => {
      try {
        assertDomainIsValid(domain);
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
    <Panel>
      <PanelHeader>Limits</PanelHeader>
      <PanelBody className="flex flex-col gap-2">
        <p>
          Add time limits to your daily web activity on specific websites. Once
          limit reached website will become black and white.
        </p>
        <div className="flex justify-between items-end gap-2">
          <label className="flex flex-col gap-1 w-full">
            Domain
            <Input
              placeholder="e.g. google.com"
              value={domainToLimit}
              onChange={handleLimitDomainChange}
            />
          </label>
          <label className="flex flex-col gap-1 w-full">
            Time limit
            <Time onChange={handleLimitTimeChange} />
          </label>
          <Button
            className="h-fit py-2 px-4 border-2 border-solid border-transparent"
            buttonType={ButtonType.Primary}
            onClick={() => handleLimitChange(domainToLimit, limit)}
          >
            Add
          </Button>
        </div>
        {limitsEntries.length > 0 ? (
          <div className="flex flex-col gap-1">
            {limitsEntries.map(([domain, limit]) => (
              <div
                key={domain}
                className="flex justify-between items-center gap-2"
              >
                <Icon
                  type={IconType.Close}
                  className="hover:text-neutral-400 cursor-pointer"
                  onClick={() => handleLimitRemove(domain)}
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
      </PanelBody>
    </Panel>
  );
};
