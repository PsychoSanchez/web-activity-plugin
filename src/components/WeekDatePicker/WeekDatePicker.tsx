import classNames from 'classnames/bind';
import * as React from 'react';

import { getIsoDate } from '../../shared/dates-helper';

import { WeekDatePickerProps } from './types';

import styles from './styles.modules.css';

const cx = classNames.bind(styles);

export const WeekDatePicker: React.FC<WeekDatePickerProps> = ({
  onWeekChange,
  sundayDate,
}) => {
  const weekStartDate = new Date();
  weekStartDate.setDate(sundayDate.getDate() - 6);

  const weekDates = `${getIsoDate(weekStartDate)} - ${getIsoDate(sundayDate)}`;

  const handleChangeWeekButtonClick = React.useCallback(
    (direction) => {
      const newWeekEndDate = new Date(sundayDate);
      newWeekEndDate.setDate(sundayDate.getDate() + direction * 7);

      onWeekChange(newWeekEndDate);
    },
    [sundayDate, onWeekChange]
  );

  return (
    <div className={cx('weekend-date-picker')}>
      <button
        className={cx('change-date-button')}
        onClick={() => handleChangeWeekButtonClick(-1)}
      >
        {'<'}
      </button>
      <div className={cx('selected-week-dates')}>{weekDates}</div>
      <button
        className={cx('change-date-button')}
        onClick={() => handleChangeWeekButtonClick(1)}
      >
        {'>'}
      </button>
    </div>
  );
};
