import * as React from 'react';

import { getAllActivityTimeline } from '../../../background/tables/activity-timeline';
import { Button, ButtonType } from '../../../blocks/Button';
import { Icon, IconType } from '../../../blocks/Icon';
import { Panel, PanelBody, PanelHeader } from '../../../blocks/Panel';
import { TimelineRecord } from '../../../shared/db/types';
import { usePopupContext } from '../../hooks/PopupContext';

export const BackupSetting: React.FC = () => {
  const { settings } = usePopupContext();

  const handleExportCSV = React.useCallback(async () => {
    const timeline = await getAllActivityTimeline();
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
        t.activityPeriodStart ?? Date.now()
      ).toLocaleTimeString();
      const endTime = new Date(
        t.activityPeriodEnd ?? Date.now()
      ).toLocaleTimeString();
      const timeInSeconds = getActivityTimelineTimeInSeconds(t);

      return `${date},"${t.hostname}","${t.docTitle}",${startTime},${endTime},${timeInSeconds}`;
    }
  }, []);

  const handleExportJSON = React.useCallback(async () => {
    const timeline = await getAllActivityTimeline();
    const blob = new Blob(
      [
        JSON.stringify({
          settings,
          timeline,
        }),
      ],
      {
        type: 'application/json',
      }
    );

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'time-tracker.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [settings]);

  return (
    <Panel>
      <PanelHeader>Backup</PanelHeader>
      <PanelBody className="flex flex-row justify-evenly">
        <Button buttonType={ButtonType.Primary} onClick={handleExportCSV}>
          <Icon type={IconType.CloudDownload}></Icon> CSV
        </Button>
        <Button buttonType={ButtonType.Primary} onClick={handleExportJSON}>
          <Icon type={IconType.CloudDownload}></Icon> JSON
        </Button>
      </PanelBody>
    </Panel>
  );
};
function getActivityTimelineTimeInSeconds(t: TimelineRecord) {
  return Math.round(
    ((t.activityPeriodEnd ?? Date.now()) - t.activityPeriodStart) / 1000
  );
}
