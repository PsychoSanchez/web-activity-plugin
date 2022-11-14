import { TimelineRecord } from '../../background/tables/idb';

export interface TimelineChartProps {
  timelineEvents: TimelineRecord[];
  emptyHoursMarginCount?: number;
}
