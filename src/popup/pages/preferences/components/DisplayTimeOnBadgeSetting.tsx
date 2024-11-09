import * as React from 'react';

// import { Checkbox } from '@shared/blocks/Input';
import { i18n } from '@shared/services/i18n';
import { Checkbox } from '@shared/ui/checkbox';

import { usePopupContext } from '@popup/hooks/PopupContext';

export const DisplayTimeOnBadgeSetting = () => {
  const { settings, updateSettings } = usePopupContext();
  const [isDisplayTimeOnIconChecked, setIsDisplayTimeOnIconChecked] =
    React.useState<boolean>(settings.displayTimeOnBadge);

  const handleDisplayTimeOnIconChange = React.useCallback<
    NonNullable<React.ComponentProps<typeof Checkbox>['onCheckedChange']>
  >(
    (e) => {
      const isChecked = e === true;
      setIsDisplayTimeOnIconChecked(isChecked);
      updateSettings({
        displayTimeOnBadge: isChecked,
      });
    },
    [setIsDisplayTimeOnIconChecked, updateSettings],
  );

  return (
    <div className="flex items-center gap-2">
      <Checkbox
        id="time-on-badge"
        checked={isDisplayTimeOnIconChecked}
        onCheckedChange={handleDisplayTimeOnIconChange}
      />
      <label
        htmlFor="time-on-badge"
        className="text-sm font-medium leading-none cursor-pointer"
      >
        {i18n('DisplayTimeOnBadge_OptionToEnable')}
      </label>
    </div>
  );
};
