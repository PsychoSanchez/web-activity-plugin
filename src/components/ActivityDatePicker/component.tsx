import * as React from 'react';
import classNames from 'classnames/bind';

import styles from './component.css';

const cx = classNames.bind(styles);

interface ActivityDatePickerProps {
  date: string;
  onChange: (date: string) => void;
}

export const ActivityDatePicker: React.FC<ActivityDatePickerProps> = ({
  date,
  onChange,
}) => {
  return (
    <div className={cx('activity-date')}>
      <input
        type="date"
        className={cx('custom-date-input')}
        value={date}
        onChange={(event) => {
          onChange(event.currentTarget.value);
        }}
      ></input>
    </div>
  );
};
