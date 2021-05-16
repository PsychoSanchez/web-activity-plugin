import * as React from 'react';

import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';
import './styles.css';

export const ActivityDatePicker = () => {
  const [startDate, setStartDate] = React.useState(new Date());

  const CustomInput = React.forwardRef<any, any>(({ value, onClick }, ref) => (
    <button className="custom-date-input" onClick={onClick} ref={ref}>
      {value}
    </button>
  ));

  return (
    <div className="date-wrapper">
      <DatePicker
        selected={startDate}
        onChange={(date: any) => setStartDate(date)}
        customInput={<CustomInput />}
      />
    </div>
  );
};
