import classNames from 'classnames/bind';
import * as React from 'react';

import { getIsoDate } from '../../shared/dates-helper';

import { WeekDatePickerProps } from './types';

import styles from './styles.css';

const cx = classNames.bind(styles);

export const WeekDatePicker: React.FC<WeekDatePickerProps> = ({
  onWeekChange,
  initialWeekEndDate: weekEndDate,
}) => {
  const weekStartDate = new Date();
  weekStartDate.setDate(weekEndDate.getDate() - 7);

  const weekDates = `${getIsoDate(weekStartDate)} - ${getIsoDate(weekEndDate)}`;

  const handleChangeWeekButtonClick = React.useCallback(
    (direction) => {
      const newWeekEndDate = new Date();
      newWeekEndDate.setDate(weekEndDate.getDate() + direction * 8);
      onWeekChange(newWeekEndDate);
    },
    [weekEndDate, onWeekChange]
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
