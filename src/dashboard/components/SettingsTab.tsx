import * as React from 'react';
import { FC } from 'react';

import { i18n } from '@shared/services/i18n';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@shared/ui/card';

import { BackupSetting } from './Backup';
import { DisplayTimeOnBadgeSetting } from './DisplayTimeOnBadgeSetting';
import { IgnoredDomainSetting } from './IgnoredDomainSetting';
import { LimitsSetting } from './LimitsSetting';
import { ThemeSelector } from './ThemeSelector';

export const SettingsTab: FC = () => {
  return (
    <div className="flex flex-col gap-4 p-4">
      <h2 className="text-2xl font-semibold">
        {i18n('PreferencesPage_Header')}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <LimitsSetting />
        <IgnoredDomainSetting />
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>{i18n('PreferencesPage_Header')}</CardTitle>
            <CardDescription>
              {i18n('PreferencesPage_Description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <DisplayTimeOnBadgeSetting />
            <ThemeSelector />
          </CardContent>
        </Card>
        <BackupSetting />
      </div>
    </div>
  );
};
