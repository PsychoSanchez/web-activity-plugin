import { CircleX } from 'lucide-react';
import * as React from 'react';
import { twMerge } from 'tailwind-merge';

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

export const IgnoredDomainSetting = () => {
  const { settings, updateSettings } = usePopupContext();
  const [ignoredDomains, setIgnoredDomains] = React.useState<
    Readonly<string[]>
  >(settings.ignoredHosts);
  const [domainToIgnore, setDomainToIgnore] = React.useState<string>('');
  const [isDomainsListExpanded, setDomainsListExpanded] =
    React.useState<boolean>(false);

  const handleAddIgnoredDomain = React.useCallback(() => {
    try {
      assertIsValidHostname(domainToIgnore);
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
    <Card>
      <CardHeader>
        <CardTitle>{i18n('IgnoredDomainSetting_Header')}</CardTitle>
        <CardDescription>
          {i18n('IgnoredDomainSetting_FeatureDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <div className="flex justify-between items-end gap-2">
          <label className="flex flex-col gap-1 w-full">
            {i18n('IgnoredDomainSetting_DomainInputLabel')}
            <Input
              placeholder="e.g. google.com"
              value={domainToIgnore}
              onChange={handleDomainToIgnoreChange}
            />
          </label>
          <Button
            className="h-fit py-2 px-4 border-2 border-solid border-transparent"
            onClick={handleAddIgnoredDomain}
          >
            {i18n('IgnoredDomainSetting_AddButton')}
          </Button>
        </div>
        <div className="flex flex-col gap-2">
          <a
            href="#"
            className="text-blue-500"
            onClick={handleToggleDomainsListExpanded}
          >
            {i18n('IgnoredDomainSetting_ViewAllIgnoredDomainsLink')}
          </a>
          <div className={twMerge('hidden', isDomainsListExpanded && 'block')}>
            {!ignoredDomains.length && (
              <p className="text-gray-500">
                {i18n('IgnoredDomainSetting_NoIgnoredDomains')}
              </p>
            )}
            {ignoredDomains.map((domain) => (
              <div key={domain} className="flex items-center gap-2">
                <CircleX
                  className="hover:text-red-500 cursor-pointer"
                  onClick={() => handleRemoveIgnoredDomain(domain)}
                  size={16}
                />
                <span>{domain}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
