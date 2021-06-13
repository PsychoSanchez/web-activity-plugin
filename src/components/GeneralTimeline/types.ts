import { TimelineRecord } from '../../background/storage/timelines';

export interface GeneralTimelineProps {
  title: string;
  emptyHoursMarginCount?: number;
  filteredHostname?: string | null;
  activityTimeline: TimelineRecord[];
}
