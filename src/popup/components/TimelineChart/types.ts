import { TimelineRecord } from '../../../shared/db/types';

export interface TimelineChartProps {
  timelineEvents: TimelineRecord[];
  emptyHoursMarginCount?: number;
}
