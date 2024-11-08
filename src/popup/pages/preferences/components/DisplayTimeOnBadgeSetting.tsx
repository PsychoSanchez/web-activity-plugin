import * as React from 'react';

import { Checkbox } from '@shared/blocks/Input';
import { i18n } from '@shared/services/i18n';

import { usePopupContext } from '../../../hooks/PopupContext';

export const DisplayTimeOnBadge = () => {
  const { settings, updateSettings } = usePopupContext();
  const [isDisplayTimeOnIconChecked, setIsDisplayTimeOnIconChecked] =
    React.useState<boolean>(settings.displayTimeOnBadge);

  const handleDisplayTimeOnIconChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setIsDisplayTimeOnIconChecked(e.target.checked);
      updateSettings({
        displayTimeOnBadge: e.target.checked,
      });
    },
    [setIsDisplayTimeOnIconChecked, updateSettings],
  );

  return (
    <label className="flex items-center cursor-pointer">
      <Checkbox
        className="mr-2"
        checked={isDisplayTimeOnIconChecked}
        onChange={handleDisplayTimeOnIconChange}
      />
      <span>{i18n('DisplayTimeOnBadge_OptionToEnable')}</span>
    </label>
  );
};
