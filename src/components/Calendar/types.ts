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
};

export interface CalendarContainerProps {}
