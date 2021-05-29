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

export type GithubCalendarProps = {
  activity: CalendarDisplayedActivity;
  onDateClick: (isoDate: string) => void;
  getTooltip?: (isoDate: string) => string;
};

export type TotalDailyActivity = Record<string, Record<string, number>>;
