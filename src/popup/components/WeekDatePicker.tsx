import { ChevronLeft, ChevronRight } from 'lucide-react';
import * as React from 'react';

import { Button } from '@shared/ui/button';
import { getIsoDate } from '@shared/utils/date';

export interface WeekDatePickerProps {
  sundayDate: Date;
  onWeekChange: (weekEndDate: Date) => void;
}

export const WeekDatePicker: React.FC<WeekDatePickerProps> = ({
  onWeekChange,
  sundayDate,
}) => {
  const weekStartDate = React.useMemo(() => {
    const date = new Date();
    date.setDate(sundayDate.getDate() - 6);
    return date;
  }, [sundayDate]);

  const handleChangeWeekButtonClick = React.useCallback(
    (direction: 1 | -1) => {
      const newWeekEndDate = new Date(sundayDate);
      newWeekEndDate.setDate(sundayDate.getDate() + direction * 7);

      onWeekChange(newWeekEndDate);
    },
    [sundayDate, onWeekChange],
  );

  return (
    <div className="flex flex-1 justify-between items-center">
      <Button
        variant="outline"
        size="icon"
        onClick={() => handleChangeWeekButtonClick(-1)}
      >
        <ChevronLeft />
      </Button>
      <div className="break-words break-all text-sm min-w-[120px] text-center dark:text-neutral-300">
        <span>{getIsoDate(weekStartDate)}</span>
        <br />
        <span>{getIsoDate(sundayDate)}</span>
      </div>
      <Button
        variant="outline"
        size="icon"
        onClick={() => handleChangeWeekButtonClick(1)}
      >
        <ChevronRight />
      </Button>
    </div>
  );
};
