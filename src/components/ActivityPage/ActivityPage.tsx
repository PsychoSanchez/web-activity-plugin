import classNames from 'classnames/bind';
import * as React from 'react';

import type { AppStore } from '../../hooks/useTimeStore';
import { getDatesWeekSundayDate, getIsoDate } from '../../shared/dates-helper';

import { ActivityDatePicker } from '../ActivityDatePicker/component';
import { DailyActivityTab } from '../ActivityPageDailyActivityTab/ActivityPageDailyActivityTab';
import { ActivityPageWeeklyActivityTab } from '../ActivityPageWeeklyActivityTab/ActivityPageWeeklyActivityTab';
import { WeekDatePicker } from '../WeekDatePicker/WeekDatePicker';

import styles from './styles.modules.css';

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
        <button
          className={cx('tab-button', activeTab === value && 'active')}
          onClick={() => setActiveTab(value)}
          key={key}
        >
          {key}
        </button>
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
