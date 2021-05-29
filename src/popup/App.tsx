import classNames from 'classnames/bind';
import * as React from 'react';

import { ActivityPage } from '../components/ActivityPage/ActivityPage';
import { OverallPage } from '../components/OverallPage/OverallPage';
import { useTimeStore } from '../hooks/useTimeStore';

import styles from './App.css';

const cx = classNames.bind(styles);

enum Tabs {
  Overall = 'overall',
  Activity = 'activity',
  Goals = 'goals',
  Limits = 'limits',
}

const TABS_VALUES = Object.values(Tabs);

export const PopupApp: React.FC<{}> = () => {
  const [activeTab, setTab] = React.useState({
    tab: Tabs.Overall,
    params: {} as Record<string, any>,
  });

  const store = useTimeStore();

  const handleNavigateToActivityDatePage = React.useCallback((date: string) => {
    setTab({
      tab: Tabs.Activity,
      params: {
        date,
      },
    });
  }, []);

  const renderedActiveTab = React.useMemo(() => {
    switch (activeTab.tab) {
      case Tabs.Overall:
        return (
          <OverallPage
            store={store}
            onNavigateToActivityPage={handleNavigateToActivityDatePage}
          />
        );
      case Tabs.Activity:
        return <ActivityPage store={store} date={activeTab.params?.date} />;
      case Tabs.Goals:
        return <span>Goals</span>;
      case Tabs.Limits:
        return <span>Limits</span>;

      default:
        return null;
    }
  }, [activeTab, store]);

  const tabs = React.useMemo(
    () =>
      TABS_VALUES.map((tab) => {
        return (
          <div
            className={cx(
              'tab',
              `${tab}-tab`,
              activeTab.tab === tab && 'active'
            )}
            key={tab}
            onClick={() => setTab({ tab, params: {} })}
          >
            {tab}
          </div>
        );
      }),
    [activeTab.tab]
  );

  return (
    <div className={cx('root')}>
      <div className={cx('header')}></div>
      <div className={cx('tabs')}>{tabs}</div>
      <div className={cx('tabs-body')}>{renderedActiveTab}</div>
    </div>
  );
};
