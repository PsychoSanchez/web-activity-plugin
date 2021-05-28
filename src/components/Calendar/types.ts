export enum CalendarDisplayedActivityType {
  Inactive = 0,
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
  navigateToDateActivityPage: (isoDate: string) => void;
};

export type TotalDailyActivity = Record<string, Record<string, number>>;
export interface CalendarContainerProps {
  store: TotalDailyActivity;
  navigateToDateActivityPage: (isoDate: string) => void;
}
