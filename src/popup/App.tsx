import { Settings } from 'lucide-react';
import * as React from 'react';

import { i18n } from '@shared/services/i18n';
import { IsoDate } from '@shared/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@shared/ui/tabs';

import { PopupContextProvider } from '@popup/hooks/PopupContext';
import { ActivityPage } from '@popup/pages/activity/ActivityPage';
import { OverallPage } from '@popup/pages/overall/OverallPage';
import { PreferencesPage } from '@popup/pages/preferences/PreferencesPage';

import '../tailwind.css';
import './App.css';
import { AppLoadingSkeletonWrapper } from './components/AppLoadingSkeleton';

enum Pages {
  Overall = 'overall',
  Detailed = 'detailed',
  Preferences = 'preferences',
}

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

  return (
    <PopupContextProvider>
      <AppLoadingSkeletonWrapper>
        <Tabs defaultValue={Pages.Overall} className="p-2">
          <TabsList className="flex">
            <TabsTrigger className="flex-1" value={Pages.Overall}>
              {i18n('PopupApp_OverallTabTitle')}
            </TabsTrigger>
            <TabsTrigger className="flex-1" value={Pages.Detailed}>
              {i18n('PopupApp_DetailedTabTitle')}
            </TabsTrigger>
            <TabsTrigger value={Pages.Preferences} className="max-w-[50px]">
              <Settings />
            </TabsTrigger>
          </TabsList>
          <TabsContent value={Pages.Overall}>
            <OverallPage
              onNavigateToActivityPage={handleNavigateToActivityDatePage}
            />
          </TabsContent>
          <TabsContent value={Pages.Detailed}>
            <ActivityPage date={activePage.params?.date} />
          </TabsContent>
          <TabsContent value={Pages.Preferences}>
            <PreferencesPage />
          </TabsContent>
        </Tabs>
      </AppLoadingSkeletonWrapper>
    </PopupContextProvider>
  );
};
