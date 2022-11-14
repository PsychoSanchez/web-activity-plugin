import { TimelineRecord } from "../../background/tables/idb";

export interface GeneralTimelineProps {
  title: string;
  emptyHoursMarginCount?: number;
  filteredHostname?: string | null;
  activityTimeline: TimelineRecord[];
}
