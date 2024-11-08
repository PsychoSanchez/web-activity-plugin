import * as React from 'react';
import { FC } from 'react';

import { Panel, PanelBody, PanelHeader } from '@shared/blocks/Panel';
import { i18n } from '@shared/services/i18n';

import { BackupSetting } from './components/Backup';
import { DisplayTimeOnBadge } from './components/DisplayTimeOnBadgeSetting';
import { IgnoredDomainSetting } from './components/IgnoredDomainSetting';
import { LimitsSetting } from './components/LimitsSetting';
import { ThemeSelector } from './components/ThemeSelector';

export const PreferencesPage: FC = () => {
  return (
    <div className="flex flex-col">
      <LimitsSetting />
      <IgnoredDomainSetting />
      <Panel>
        <PanelHeader>{i18n('PreferencesPage_Header')}</PanelHeader>
        <PanelBody className="flex flex-col gap-1">
          <DisplayTimeOnBadge />
          <ThemeSelector />
        </PanelBody>
      </Panel>
      <BackupSetting />
    </div>
  );
};
