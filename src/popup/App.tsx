import classNames from 'classnames/bind';
import * as React from 'react';
import { browser } from 'webextension-polyfill-ts';

import { ActivityPage } from '../components/ActivityPage/ActivityPage';
import { ActivityCalendarContainer } from '../components/Calendar/container';
import styles from './App.css';

const cx = classNames.bind(styles);

enum Tabs {
  Overall = 'overall',
  Activity = 'activty',
  Goals = 'goals',
  Limits = 'limits',
}

export const PopupApp: React.FC<{}> = () => {
  const [activeTab, setTab] = React.useState(Tabs.Overall);
  const [activityStore, setDailyActivityStore] = React.useState<
    Record<string, Record<string, number>>
  >({});

  React.useEffect(() => {
    browser.storage.local.get().then((activity: Record<string, any>) => {
      setDailyActivityStore(activity);
    });
  }, []);

  const renderedActiveTab = React.useMemo(() => {
    switch (activeTab) {
      case Tabs.Overall:
        return <ActivityCalendarContainer store={activityStore} />;
      case Tabs.Activity:
        return <ActivityPage store={activityStore} />;
      case Tabs.Goals:
        return <span>Goals</span>;
      case Tabs.Limits:
        return <span>Limits</span>;

      default:
        return null;
    }
  }, [activeTab, activityStore]);

  return (
    <div className={cx('root')}>
      <div className={cx('header')}></div>
      <div className={cx('tabs')}>
        {Object.values(Tabs).map((tab) => {
          return (
            <div
              className={cx('tab', `${tab}-tab`, activeTab === tab && 'active')}
              key={tab}
              onClick={() => setTab(tab)}
            >
              {tab}
            </div>
          );
        })}
      </div>
      <div className={cx('tabs-body')}>{renderedActiveTab}</div>
    </div>
  );
};
