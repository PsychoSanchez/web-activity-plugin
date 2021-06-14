import { TimelineRecord } from '../../background/storage/timelines';

export interface TimelineChartProps {
  timelineEvents: TimelineRecord[];
  emptyHoursMarginCount?: number;
}
