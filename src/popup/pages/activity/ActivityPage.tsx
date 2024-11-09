import * as React from 'react';

import { IsoDate } from '@shared/types';
import { Button } from '@shared/ui/button';
import { Card } from '@shared/ui/card';
import { getDatesWeekSundayDate, getIsoDate } from '@shared/utils/date';

import { DatePicker } from '@popup/components/DatePicker';
import { WeekDatePicker } from '@popup/components/WeekDatePicker';
import { usePopupContext } from '@popup/hooks/PopupContext';

import { DailyActivityTab } from './components/DailyActivityTab';
import { WeeklyActivityTab } from './components/WeeklyActivityTab';

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
          variant={activeTab === value ? 'default' : 'outline'}
          onClick={() => setActiveTab(value)}
          key={key}
        >
          {key}
        </Button>
      );
    });
  }, [activeTab]);

  return (
    <div className="flex flex-col gap-2">
      <Card className="flex items-center justify-between p-2 gap-2 bg-muted">
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
      </Card>

      {activeTab === ActivityPageTabs.Daily && (
        <DailyActivityTab store={store} date={pickedIsoDate} />
      )}

      {activeTab === ActivityPageTabs.Weekly && (
        <WeeklyActivityTab store={store} sundayDate={pickedSunday} />
      )}
    </div>
  );
};
