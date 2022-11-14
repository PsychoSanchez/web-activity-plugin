import { TimelineRecord } from "../../../shared/db/types";

export interface GeneralTimelineProps {
  title: string;
  emptyHoursMarginCount?: number;
  filteredHostname?: string | null;
  activityTimeline: TimelineRecord[];
}
