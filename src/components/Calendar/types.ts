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
