import * as React from 'react';
import { twMerge } from 'tailwind-merge';

import { Icon, IconType } from '@shared/blocks/Icon';
import { Panel } from '@shared/blocks/Panel';
import { IsoDate } from '@shared/types';

import { PopupContextProvider } from '@popup/hooks/PopupContext';
import { ActivityPage } from '@popup/pages/activity/ActivityPage';
import { OverallPage } from '@popup/pages/overall/OverallPage';
import { PreferencesPage } from '@popup/pages/preferences/PreferencesPage';

import '../tailwind.css';
import './App.css';

enum Pages {
  Overall = 'overall',
  Detailed = 'detailed',
  Preferences = 'preferences',
}

const PAGES_VALUES = Object.values(Pages);

export const PopupApp = () => {
  const [activePage, setPage] = React.useState({
    tab: Pages.Overall,
    params: {} as Record<string, IsoDate>,
  });

  const handleNavigateToActivityDatePage = React.useCallback(
    (date: IsoDate) => {
      setPage({
        tab: Pages.Detailed,
        params: {
          date,
        },
      });
    },
    [],
  );

  const renderedActiveTab = React.useMemo(() => {
    switch (activePage.tab) {
      case Pages.Overall:
        return (
          <OverallPage
            onNavigateToActivityPage={handleNavigateToActivityDatePage}
          />
        );
      case Pages.Detailed:
        return <ActivityPage date={activePage.params?.date} />;
      case Pages.Preferences:
        return <PreferencesPage />;

      default:
        return null;
    }
  }, [
    activePage.params?.date,
    activePage.tab,
    handleNavigateToActivityDatePage,
  ]);

  const tabs = React.useMemo(
    () =>
      PAGES_VALUES.map((tab) => {
        return (
          <div
            className={twMerge(
              'cursor-pointer flex-1 capitalize text-center rounded-xl p-2 text-lg font-light transition-colors duration-300',
              activePage.tab === tab &&
                'bg-neutral-300 text-neutral-800 dark:bg-neutral-900 dark:text-neutral-200',
              activePage.tab !== tab &&
                'hover:bg-neutral-100 text-neutral-400 dark:hover:bg-neutral-900 dark:text-neutral-400',
              tab === Pages.Preferences && 'max-w-[75px]',
            )}
            key={tab}
            onClick={() => setPage({ tab, params: {} })}
          >
            {tab === Pages.Preferences ? (
              <Icon type={IconType.BurgerMenu} className="m-0" />
            ) : (
              tab
            )}
          </div>
        );
      }),
    [activePage.tab],
  );

  return (
    <PopupContextProvider>
      <div className="flex flex-col p-2 pt-4 dark:bg-neutral-900">
        <Panel className="flex gap-2 p-2 font-semibold">{tabs}</Panel>
        <Panel className="p-2 border-none bg-slate-200 dark:bg-slate-800 tab-body-shadow dark:dark-tab-body-shadow">
          {renderedActiveTab}
        </Panel>
      </div>
    </PopupContextProvider>
  );
};
