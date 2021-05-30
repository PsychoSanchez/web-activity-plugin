import { AppStore } from '../../hooks/useTimeStore';

export interface WeeklyWebsiteActivityChartProps {
  store: AppStore;
  sundayDate: Date;
  presentChartTitle?: (weekName: string) => string;
}
