import classNames from 'classnames/bind';
import * as React from 'react';

import { Button, ButtonType } from '../../../blocks/Button/Button';
import { ActivityDatePicker } from '../../../components/ActivityDatePicker/component';
import { DailyActivityTab } from '../../../components/ActivityPageDailyActivityTab/ActivityPageDailyActivityTab';
import { ActivityPageWeeklyActivityTab } from '../../../components/ActivityPageWeeklyActivityTab/ActivityPageWeeklyActivityTab';
import { WeekDatePicker } from '../../../components/WeekDatePicker/WeekDatePicker';
import type { AppStore } from '../../../hooks/useTimeStore';
import {
  getDatesWeekSundayDate,
  getIsoDate,
} from '../../../shared/dates-helper';

import styles from './styles.css';

const cx = classNames.bind(styles);

interface ActivityPageProps {
  store: AppStore;
  date?: string;
}

enum ActivityPageTabs {
  Daily,
  Weekly,
}

export const ActivityPage: React.FC<ActivityPageProps> = ({
  store,
  date: openOnDate,
}) => {
  const [activeTab, setActiveTab] = React.useState(ActivityPageTabs.Daily);

  const [pickedIsoDate, setPickedIsoDate] = React.useState(
    openOnDate || getIsoDate(new Date())
  );

  const [pickedSunday, setPickedSunday] = React.useState(
    getDatesWeekSundayDate()
  );

  const tabs = React.useMemo(() => {
    return Object.entries(ActivityPageTabs).map(([key, value]) => {
      if (typeof value === 'string') {
        return;
      }

      return (
        <Button
          buttonType={
            activeTab === value ? ButtonType.Primary : ButtonType.Secondary
          }
          onClick={() => setActiveTab(value)}
          key={key}
        >
          {key}
        </Button>
      );
    });
  }, [activeTab]);

  return (
    <>
      <div className={cx('header')}>
        <div className={cx('tabs')}>{tabs}</div>
        {activeTab === ActivityPageTabs.Daily && (
          <ActivityDatePicker
            date={pickedIsoDate}
            onChange={setPickedIsoDate}
          />
        )}
        {activeTab === ActivityPageTabs.Weekly && (
          <WeekDatePicker
            sundayDate={pickedSunday}
            onWeekChange={setPickedSunday}
          />
        )}
      </div>

      {activeTab === ActivityPageTabs.Daily && (
        <DailyActivityTab store={store} date={pickedIsoDate} />
      )}

      {activeTab === ActivityPageTabs.Weekly && (
        <ActivityPageWeeklyActivityTab
          store={store}
          sundayDate={pickedSunday}
        />
      )}
    </>
  );
};
