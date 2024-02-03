import * as React from 'react';

import { Button, ButtonType } from '@shared/blocks/Button';
import { Icon, IconType } from '@shared/blocks/Icon';
import { getIsoDate } from '@shared/utils/dates-helper';

export interface WeekDatePickerProps {
  sundayDate: Date;
  onWeekChange: (weekEndDate: Date) => void;
}

export const WeekDatePicker: React.FC<WeekDatePickerProps> = ({
  onWeekChange,
  sundayDate,
}) => {
  const weekStartDate = new Date();
  weekStartDate.setDate(sundayDate.getDate() - 6);

  const handleChangeWeekButtonClick = React.useCallback(
    (direction) => {
      const newWeekEndDate = new Date(sundayDate);
      newWeekEndDate.setDate(sundayDate.getDate() + direction * 7);

      onWeekChange(newWeekEndDate);
    },
    [sundayDate, onWeekChange],
  );

  return (
    <div className="flex flex-1 justify-between items-center">
      <Button
        buttonType={ButtonType.Secondary}
        onClick={() => handleChangeWeekButtonClick(-1)}
      >
        <Icon className="m-0 flex" type={IconType.LeftArrow} />
      </Button>
      <div className="break-words break-all text-sm min-w-[120px] text-center dark:text-neutral-300">
        <span>{getIsoDate(weekStartDate)}</span>
        <br />
        <span>{getIsoDate(sundayDate)}</span>
      </div>
      <Button
        buttonType={ButtonType.Secondary}
        onClick={() => handleChangeWeekButtonClick(1)}
      >
        <Icon className="m-0 flex" type={IconType.RightArrow} />
      </Button>
    </div>
  );
};
