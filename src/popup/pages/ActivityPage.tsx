import * as React from 'react';

import { Button, ButtonType } from '@shared/blocks/Button';
import { Panel } from '@shared/blocks/Panel';
import { IsoDate } from '@shared/types';
import { getDatesWeekSundayDate, getIsoDate } from '@shared/utils/date';

import { DatePicker } from '@popup/components/DatePicker';
import { WeekDatePicker } from '@popup/components/WeekDatePicker';
import { usePopupContext } from '@popup/hooks/PopupContext';

import { DailyActivityTab } from './activity/ActivityPageDailyActivityTab';
import { ActivityPageWeeklyActivityTab } from './activity/ActivityPageWeeklyActivityTab';

interface ActivityPageProps {
  date?: IsoDate;
}

enum ActivityPageTabs {
  Daily,
  Weekly,
}

export const ActivityPage: React.FC<ActivityPageProps> = ({
  date: openOnDate,
}) => {
  const [activeTab, setActiveTab] = React.useState(ActivityPageTabs.Daily);
  const [pickedIsoDate, setPickedIsoDate] = React.useState(
    openOnDate || getIsoDate(new Date()),
  );
  const [pickedSunday, setPickedSunday] = React.useState(
    getDatesWeekSundayDate(),
  );

  const { store } = usePopupContext();

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
      <Panel className="flex items-center justify-between p-2 gap-2">
        <div className="flex gap-2">{tabs}</div>
        {activeTab === ActivityPageTabs.Daily && (
          <DatePicker date={pickedIsoDate} onChange={setPickedIsoDate} />
        )}
        {activeTab === ActivityPageTabs.Weekly && (
          <WeekDatePicker
            sundayDate={pickedSunday}
            onWeekChange={setPickedSunday}
          />
        )}
      </Panel>

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
