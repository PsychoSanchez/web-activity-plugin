import * as React from 'react';

import './styles.css';

interface ActivityDatePickerProps {
  date: string;
  onChange: (date: string) => void;
}

export const ActivityDatePicker: React.FC<ActivityDatePickerProps> = ({
  date,
  onChange,
}) => {
  return (
    <div className="date-wrapper">
      <input
        type="date"
        className="custom-date-input"
        value={date}
        onChange={(event) => {
          onChange(event.currentTarget.value);
        }}
      ></input>
    </div>
  );
};
