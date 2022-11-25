import { TimeStore } from '../../hooks/useTimeStore';

export interface WeeklyWebsiteActivityChartProps {
  store: TimeStore;
  sundayDate: Date;
  presentChartTitle?: (weekName: string) => string;
}
