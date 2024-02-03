import * as React from 'react';
import { twMerge } from 'tailwind-merge';

import { Button, ButtonType } from '@shared/blocks/Button';
import { Icon, IconType } from '@shared/blocks/Icon';
import { Input } from '@shared/blocks/Input';
import { Panel, PanelBody, PanelHeader } from '@shared/blocks/Panel';
import { assertDomainIsValid } from '@shared/utils/domains';

import { usePopupContext } from '../../hooks/PopupContext';

export const IgnoredDomainSetting: React.FC = () => {
  const { settings, updateSettings } = usePopupContext();
  const [ignoredDomains, setIgnoredDomains] = React.useState<string[]>(
    settings.ignoredHosts,
  );
  const [domainToIgnore, setDomainToIgnore] = React.useState<string>('');
  const [isDomainsListExpanded, setDomainsListExpanded] =
    React.useState<boolean>(false);

  const handleAddIgnoredDomain = React.useCallback(() => {
    try {
      assertDomainIsValid(domainToIgnore);
      setIgnoredDomains((prev) => {
        const newIgnoredHostList = Array.from(
          new Set([...prev, domainToIgnore]),
        );

        updateSettings({
          ignoredHosts: newIgnoredHostList,
        });

        return newIgnoredHostList;
      });

      setDomainToIgnore('');
    } catch (_) {
      //
    }
  }, [domainToIgnore, updateSettings]);

  const handleRemoveIgnoredDomain = React.useCallback(
    (domain: string) => {
      setIgnoredDomains((prev) => {
        const newIgnoredHostList = prev.filter((d) => d !== domain);

        updateSettings({
          ignoredHosts: newIgnoredHostList,
        });

        return newIgnoredHostList;
      });
    },
    [setIgnoredDomains, updateSettings],
  );

  const handleDomainToIgnoreChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setDomainToIgnore(e.target.value);
    },
    [],
  );

  const handleToggleDomainsListExpanded = React.useCallback(() => {
    setDomainsListExpanded((prev) => !prev);
  }, [setDomainsListExpanded]);

  return (
    <Panel>
      <PanelHeader>Ignored domains</PanelHeader>
      <PanelBody className="flex flex-col gap-2">
        <p>You can hide unwanted websites to keep dashboards clean.</p>
        <div className="flex justify-between items-end gap-2">
          <label className="flex flex-col gap-1 w-full">
            Domain
            <Input
              placeholder="e.g. google.com"
              value={domainToIgnore}
              onChange={handleDomainToIgnoreChange}
            />
          </label>
          <Button
            className="h-fit py-2 px-4 border-2 border-solid border-transparent"
            buttonType={ButtonType.Primary}
            onClick={handleAddIgnoredDomain}
          >
            Add
          </Button>
        </div>
        <div className="flex flex-col gap-2">
          <a
            href="#"
            className="text-blue-500"
            onClick={handleToggleDomainsListExpanded}
          >
            View all ignored domains
          </a>
          <div className={twMerge('hidden', isDomainsListExpanded && 'block')}>
            {!ignoredDomains.length && (
              <p className="text-gray-500">No ignored domains</p>
            )}
            {ignoredDomains.map((domain) => (
              <div key={domain} className="flex items-center gap-2">
                <Icon
                  type={IconType.Close}
                  className="hover:text-neutral-400 cursor-pointer"
                  onClick={() => handleRemoveIgnoredDomain(domain)}
                />
                <span>{domain}</span>
              </div>
            ))}
          </div>
        </div>
      </PanelBody>
    </Panel>
  );
};
