import { CloudDownload } from 'lucide-react';
import * as React from 'react';

import { TimelineRecord } from '@shared/db/types';
import { i18n } from '@shared/services/i18n';
import { getFullActivityTimeline } from '@shared/tables/activity-timeline';
import { Button } from '@shared/ui/button';
import { Card, CardFooter, CardHeader, CardTitle } from '@shared/ui/card';

import { usePopupContext } from '@popup/hooks/PopupContext';

function getActivityTimelineTimeInSeconds(t: TimelineRecord) {
  return Math.round(
    ((t.activityPeriodEnd ?? Date.now()) - t.activityPeriodStart) / 1000,
  );
}

export const BackupSetting = () => {
  const { settings } = usePopupContext();

  const handleExportCSV = React.useCallback(async () => {
    const timeline = await getFullActivityTimeline();
    const csv = [
      'Date,Domain,Page Title,Time start, Time end,Time Spent (seconds)',
      ...timeline.map((t) => presentTimeline(t)),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');

    a.href = url;
    a.download = 'time-tracker.csv';
    a.click();

    URL.revokeObjectURL(url);

    function presentTimeline(t: TimelineRecord): string {
      const date = new Date(t.activityPeriodStart).toLocaleDateString();
      const startTime = new Date(
        t.activityPeriodStart ?? Date.now(),
      ).toLocaleTimeString();
      const endTime = new Date(
        t.activityPeriodEnd ?? Date.now(),
      ).toLocaleTimeString();
      const timeInSeconds = getActivityTimelineTimeInSeconds(t);

      return `${date},"${t.hostname}","${t.docTitle}",${startTime},${endTime},${timeInSeconds}`;
    }
  }, []);

  const handleExportJSON = React.useCallback(async () => {
    const timeline = await getFullActivityTimeline();
    const blob = new Blob(
      [
        JSON.stringify({
          settings,
          timeline,
        }),
      ],
      {
        type: 'application/json',
      },
    );

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'time-tracker.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [settings]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{i18n('Backup_Header')}</CardTitle>
      </CardHeader>
      <CardFooter className="flex flex-row justify-evenly">
        <Button variant="default" onClick={handleExportCSV}>
          <CloudDownload /> {i18n('Backup_OptionCSV')}
        </Button>
        <Button variant="default" onClick={handleExportJSON}>
          <CloudDownload /> {i18n('Backup_OptionJSON')}
        </Button>
      </CardFooter>
    </Card>
  );
};
