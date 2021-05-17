import * as React from 'react';
import classNames from 'classnames/bind';

import { DailyUsageContainer } from '../components/DailyUsage/container';
import { ActivityCalendarContainer } from '../components/Calendar/container';

import styles from './App.css';

const cx = classNames.bind(styles);

export const PopupApp: React.FC<{}> = () => {
  return (
    <div className={cx('root')}>
      <ActivityCalendarContainer></ActivityCalendarContainer>
      <DailyUsageContainer></DailyUsageContainer>
    </div>
  );
};
