import classNames from 'classnames/bind';
import * as React from 'react';

import { Button, ButtonType } from '../../blocks/Button/Button';
import { getDaysInMs, getIsoDate } from '../../shared/dates-helper';

import styles from './component.css';

const cx = classNames.bind(styles);

interface ActivityDatePickerProps {
  date: string;
  onChange: (date: string) => void;
}

const DAY_IN_MS = getDaysInMs(1);
export const ActivityDatePicker: React.FC<ActivityDatePickerProps> = ({
  date,
  onChange,
}) => {
  const onDateChangeButtonClick = React.useCallback(
    (direction: 1 | -1) => {
      const selectedDate = new Date(date);
      const targetDateTs = selectedDate.valueOf() + direction * DAY_IN_MS;
      const targetDate = new Date(targetDateTs);
      const isoDate = getIsoDate(targetDate);

      onChange(isoDate);
    },
    [date, onChange]
  );

  return (
    <div className={cx('activity-date')}>
      <Button
        buttonType={ButtonType.Secondary}
        className={cx('previous-date', 'change-date-button')}
        onClick={() => onDateChangeButtonClick(-1)}
      >
        {'<'}
      </Button>
      <input
        type="date"
        className={cx('custom-date-input')}
        value={date}
        onChange={(event) => {
          onChange(event.currentTarget.value);
        }}
      />
      <Button
        buttonType={ButtonType.Secondary}
        className={cx('next-date', 'change-date-button')}
        onClick={() => onDateChangeButtonClick(1)}
      >
        {'>'}
      </Button>
    </div>
  );
};
