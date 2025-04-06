import { CircleX } from 'lucide-react';
import * as React from 'react';

import { useSettings } from '@shared/hooks/useSettings';
import { i18n } from '@shared/services/i18n';
import { Button } from '@shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card';
import { Input } from '@shared/ui/input';
import { assertIsValidHostname } from '@shared/utils/url';

export const IgnoredDomainsPage = () => {
  const [settings, updateSettings] = useSettings();
  const [ignoredDomains, setIgnoredDomains] = React.useState<
    Readonly<string[]>
  >(settings.ignoredHosts);
  const [domainToIgnore, setDomainToIgnore] = React.useState<string>('');

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
    } catch (error) {
      console.error('Failed to add domain:', error);
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
    [updateSettings],
  );

  const handleDomainToIgnoreChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setDomainToIgnore(e.target.value);
    },
    [],
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          {i18n('IgnoredDomainSetting_Header')}
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{i18n('IgnoredDomainSetting_DomainInputLabel')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="e.g. google.com"
              value={domainToIgnore}
              onChange={handleDomainToIgnoreChange}
              className="flex-1"
            />
            <Button onClick={handleAddIgnoredDomain}>
              {i18n('IgnoredDomainSetting_AddButton')}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {i18n('IgnoredDomainSetting_ViewAllIgnoredDomainsLink')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!ignoredDomains.length ? (
            <p className="text-gray-500">
              {i18n('IgnoredDomainSetting_NoIgnoredDomains')}
            </p>
          ) : (
            <div className="space-y-2">
              {ignoredDomains.map((domain) => (
                <div
                  key={domain}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                >
                  <span>{domain}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveIgnoredDomain(domain)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <CircleX className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
