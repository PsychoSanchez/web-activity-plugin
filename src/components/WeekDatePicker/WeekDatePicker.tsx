import classNames from 'classnames/bind';
import * as React from 'react';

import { Button, ButtonType } from '../../blocks/Button/Button';
import { getIsoDate } from '../../shared/dates-helper';

import { WeekDatePickerProps } from './types';

import styles from './styles.css';

const cx = classNames.bind(styles);

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
    [sundayDate, onWeekChange]
  );

  return (
    <div className={cx('weekend-date-picker')}>
      <Button
        buttonType={ButtonType.Secondary}
        className={cx('change-date-button')}
        onClick={() => handleChangeWeekButtonClick(-1)}
      >
        {'<'}
      </Button>
      <div className={cx('selected-week-dates')}>
        <span>{getIsoDate(weekStartDate)}</span>
        <br />
        <span>{getIsoDate(sundayDate)}</span>
      </div>
      <Button
        buttonType={ButtonType.Secondary}
        className={cx('change-date-button')}
        onClick={() => handleChangeWeekButtonClick(1)}
      >
        {'>'}
      </Button>
    </div>
  );
};
