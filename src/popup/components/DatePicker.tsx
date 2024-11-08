import * as React from 'react';

import { Button, ButtonType } from '@shared/blocks/Button';
import { Icon, IconType } from '@shared/blocks/Icon';
import { IsoDate } from '@shared/types';
import { assertIsIsoDate, getDaysInMs, getIsoDate } from '@shared/utils/date';

const DAY_IN_MS = getDaysInMs(1);

interface DatePickerProps {
  date: IsoDate;
  onChange: (date: IsoDate) => void;
}

export const DatePicker: React.FC<DatePickerProps> = ({ date, onChange }) => {
  const onDateChangeButtonClick = React.useCallback(
    (direction: 1 | -1) => {
      const selectedDate = new Date(date);
      const targetDateTs = selectedDate.valueOf() + direction * DAY_IN_MS;
      const targetDate = new Date(targetDateTs);
      const isoDate = getIsoDate(targetDate);

      onChange(isoDate);
    },
    [date, onChange],
  );

  const handleChangeToSpecificDate = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      assertIsIsoDate(event.currentTarget.value);

      onChange(event.currentTarget.value);
    },
    [onChange],
  );

  return (
    <div className="flex flex-1 justify-between items-center">
      <Button
        buttonType={ButtonType.Secondary}
        onClick={() => onDateChangeButtonClick(-1)}
      >
        <Icon className="m-0 flex" type={IconType.LeftArrow} />
      </Button>
      <input
        type="date"
        className="cursor-pointer text-center bg-transparent border-none text-base max-w-[120px] dark:text-neutral-300"
        value={date}
        onChange={handleChangeToSpecificDate}
      />
      <Button
        buttonType={ButtonType.Secondary}
        onClick={() => onDateChangeButtonClick(1)}
      >
        <Icon className="m-0 flex" type={IconType.RightArrow} />
      </Button>
    </div>
  );
};
