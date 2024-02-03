import * as React from 'react';
import { FC } from 'react';

import { Panel, PanelBody, PanelHeader } from '@shared/blocks/Panel';

import { BackupSetting } from './preferences/Backup';
import { DisplayTimeOnBadge } from './preferences/DisplayTimeOnBadgeSetting';
import { IgnoredDomainSetting } from './preferences/IgnoredDomainSetting';
import { LimitsSetting } from './preferences/LimitsSetting';
import { ThemeSelector } from './preferences/ThemeSelector';

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
