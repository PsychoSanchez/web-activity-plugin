import * as React from 'react';
import { FC } from 'react';

import { Panel, PanelBody, PanelHeader } from '../../shared/blocks/Panel';

import { BackupSetting } from '../components/Backup/Backup';
import { DisplayTimeOnBadge } from '../components/DisplayTimeOnBadgeSetting/DisplayTimeOnBadgeSetting';
import { IgnoredDomainSetting } from '../components/IgnoredDomainsSetting/IgnoredDomainSetting';
import { LimitsSetting } from '../components/LimitsSetting/LimitsSetting';
import { ThemeSelector } from '../components/ThemeSelector';

export const PreferencesPage: FC = () => {
  return (
    <div className="flex flex-col">
      <LimitsSetting />
      <IgnoredDomainSetting />
      <Panel>
        {/* App preferences */}
        <PanelHeader>Preferences</PanelHeader>
        <PanelBody className="flex flex-col gap-1">
          <DisplayTimeOnBadge />
          <ThemeSelector />
        </PanelBody>
      </Panel>
      <BackupSetting />
    </div>
  );
};
