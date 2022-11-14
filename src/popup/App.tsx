import cx from 'classnames';
import * as React from 'react';

import { Panel } from '../blocks/Panel';
import { useTimeStore } from './hooks/useTimeStore';

import { ActivityPage } from './pages/ActivityPage';
import { OverallPage } from './pages/OverallPage';

import './App.css';

enum Tabs {
  Overall = 'overall',
  Detailed = 'detailed',
  // Goals = 'goals',
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
      tab: Tabs.Detailed,
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
      case Tabs.Detailed:
        return <ActivityPage store={store} date={activeTab.params?.date} />;
      // case Tabs.Goals:
      //   return <span>Goals</span>;

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
              'cursor-pointer flex-1 capitalize text-center rounded-xl p-2 text-lg font-light transition-colors duration-300',
              activeTab.tab === tab &&
                'bg-neutral-300 text-neutral-800 dark:bg-neutral-900 dark:text-neutral-200',
              activeTab.tab !== tab &&
                'hover:bg-neutral-100 text-neutral-400 dark:hover:bg-neutral-900 dark:text-neutral-400'
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
    <div className="flex flex-col p-2 pt-4 dark:bg-neutral-900">
      {/* <div className={cx('header')}></div> */}
      <Panel className="flex gap-2 p-2 font-semibold">{tabs}</Panel>
      <Panel className="p-2 border-none bg-slate-200 dark:bg-slate-800 tab-body-shadow dark:dark-tab-body-shadow">
        {renderedActiveTab}
      </Panel>
    </div>
  );
};
