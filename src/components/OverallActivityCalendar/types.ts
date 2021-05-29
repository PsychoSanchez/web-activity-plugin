import { TotalDailyActivity } from '../GithubCalendarWrapper/types';

export interface OverallActivityCalendarProps {
  store: TotalDailyActivity;
  navigateToDateActivityPage: (isoDate: string) => void;
}
