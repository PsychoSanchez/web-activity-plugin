import * as React from 'react';

import { Checkbox } from '@shared/blocks/Input';

import { usePopupContext } from '../../hooks/PopupContext';

export const DisplayTimeOnBadge: React.FC = () => {
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
      <span>Display active time on icon</span>
    </label>
  );
};
