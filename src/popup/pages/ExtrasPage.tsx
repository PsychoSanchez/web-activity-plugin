import * as React from 'react';
import { FC } from 'react';

import { Button, ButtonType } from '../../blocks/Button';
import { Icon, IconType } from '../../blocks/Icon';
import { Panel, PanelBody, PanelHeader } from '../../blocks/Panel';

import { DisplayTimeOnBadge } from '../components/DisplayTimeOnBadgeSetting/DisplayTimeOnBadgeSetting';
import { IgnoredDomainSetting } from '../components/IgnoredDomainsSetting/IgnoredDomainSetting';
import { LimitsSetting } from '../components/LimitsSetting/LimitsSetting';
import { ThemeSelector } from '../components/ThemeSelector';

export const ExtrasPage: FC = () => {
  return (
    <div className="flex flex-col">
      <LimitsSetting />
      <IgnoredDomainSetting />
      <Panel>
        <PanelHeader>Preferences</PanelHeader>
        <PanelBody className="flex flex-col gap-1">
          <DisplayTimeOnBadge />
          <ThemeSelector />
        </PanelBody>
      </Panel>
      <Panel>
        <PanelHeader>Backup</PanelHeader>
        <PanelBody className="flex flex-row justify-evenly">
          <Button buttonType={ButtonType.Primary}>
            <Icon type={IconType.CloudDownload}></Icon> CSV
          </Button>
          <Button buttonType={ButtonType.Primary}>
            <Icon type={IconType.CloudDownload}></Icon> JSON
          </Button>
        </PanelBody>
      </Panel>
    </div>
  );
};
