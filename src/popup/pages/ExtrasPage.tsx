import * as React from 'react';
import { FC } from 'react';

import { Panel, PanelBody, PanelHeader } from '../../blocks/Panel';

import { ThemeSelector } from '../components/ThemeSelector';

export const ExtrasPage: FC = () => {
  return (
    <div className="flex flex-col">
      <Panel>
        <PanelHeader>Preferences</PanelHeader>
        <PanelBody>
          <ThemeSelector />
        </PanelBody>
      </Panel>
    </div>
  );
};
