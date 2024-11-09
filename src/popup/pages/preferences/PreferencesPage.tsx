import * as React from 'react';
import { FC } from 'react';

import { i18n } from '@shared/services/i18n';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card';

import { BackupSetting } from './components/Backup';
import { DisplayTimeOnBadgeSetting } from './components/DisplayTimeOnBadgeSetting';
import { IgnoredDomainSetting } from './components/IgnoredDomainSetting';
import { LimitsSetting } from './components/LimitsSetting';
import { ThemeSelector } from './components/ThemeSelector';

export const PreferencesPage: FC = () => {
  return (
    <div className="flex flex-col gap-2">
      <LimitsSetting />
      <IgnoredDomainSetting />
      <Card>
        <CardHeader>
          <CardTitle>{i18n('PreferencesPage_Header')}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <DisplayTimeOnBadgeSetting />
          <ThemeSelector />
        </CardContent>
      </Card>
      <BackupSetting />
    </div>
  );
};
