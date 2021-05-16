import { BrowserSyncStorage } from '../../shared/browser-sync-storage';

export enum CalendarDisplayedActivityType {
  VeryLow = 1,
  Low,
  Medium,
  High,
}

export type CalendarDisplayedActivity = Record<
  string,
  CalendarDisplayedActivityType
>;

export type ActivityCalendarProps = {
  activity: CalendarDisplayedActivity;
};

export interface CalendarContainerProps {}
