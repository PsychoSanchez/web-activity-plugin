import { IsoDate } from '@shared/types';

const SECOND_IN_MS = 1000;
const MINUTE_IN_MS = 60 * SECOND_IN_MS;
const HOUR_IN_MS = 60 * MINUTE_IN_MS;
const DAY_IN_MS = 24 * HOUR_IN_MS;
const WEEK_IN_MS = 7 * DAY_IN_MS;
const MONTH_IN_MS = 30 * DAY_IN_MS;
const YEAR_IN_MS = 365 * DAY_IN_MS;

export const getIsoDate = (date: Date = new Date()): IsoDate => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  const isoDate = `${year}-${month}-${day}` as IsoDate;

  return isoDate;
};

export function assertIsIsoDate(date: string): asserts date is IsoDate {
  if (!date.match(/^\d{4}-\d{2}-\d{2}$/)) {
    throw new Error('assertIsIsoDate: Invalid date format');
  }
}

export const getMinutesInMs = (number: number) => number * MINUTE_IN_MS;
export const getHoursInMs = (number: number) => number * HOUR_IN_MS;
export const getDaysInMs = (number: number) => number * DAY_IN_MS;

export const getTimeFromMs = (number: number) => {
  const seconds = Math.floor((number / SECOND_IN_MS) % 60);
  const minutes = Math.floor((number / MINUTE_IN_MS) % 60);
  const hours = Math.floor((number / HOUR_IN_MS) % 24);
  const days = Math.floor((number / DAY_IN_MS) % 365);

  const presentedDays = days > 0 ? `${days}d` : '';
  const presentedHours = hours > 0 ? `${hours}h` : '';
  const presentedMinutes = minutes > 0 ? `${minutes}m` : '';
  const presentedSeconds = `${seconds}s`;

  return [presentedDays, presentedHours, presentedMinutes, presentedSeconds]
    .filter(Boolean)
    .join(' ');
};

export const parseTime = (ms: number) => {
  const seconds = Math.floor(ms / SECOND_IN_MS);
  const minutes = Math.floor(ms / MINUTE_IN_MS);
  const hours = Math.floor(ms / HOUR_IN_MS);
  const days = Math.floor(ms / DAY_IN_MS);
  const weeks = Math.floor(ms / WEEK_IN_MS);
  const years = Math.floor(ms / YEAR_IN_MS);
  const months = Math.floor(ms / MONTH_IN_MS);

  return {
    days,
    hours,
    minutes,
    seconds,
    weeks,
    months,
    years,
  };
};

export const getTimeWithoutSeconds = (number: number) => {
  const minutes = Math.floor((number / MINUTE_IN_MS) % 60);
  const hours = Math.floor((number / HOUR_IN_MS) % 24);
  const days = Math.floor((number / DAY_IN_MS) % 365);

  const presentedDays = days > 0 ? `${days}d` : '';
  const presentedHours = hours > 0 ? `${hours}h` : '';
  const presentedMinutes = hours > 0 && minutes === 0 ? '' : `${minutes}m`;

  return [presentedDays, presentedHours, presentedMinutes]
    .filter(Boolean)
    .join(' ');
};

const DEFAULT_DATE_TRANSFORMER = (date: Date) => new Date(date);

export const generatePrior7DaysDates = <
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- T is a generic
  T extends (date: Date) => any = (date: Date) => Date,
>(
  date: Date,
  map?: T,
): ReturnType<T>[] =>
  rangeDaysAgo({
    from: date,
    days: 7,
    map: map || (DEFAULT_DATE_TRANSFORMER as T),
  });

export const rangeDaysAgo = <
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- T is a generic
  DateTransformer extends (date: Date) => any = (date: Date) => Date,
>({
  from: date,
  days,
  map,
}: {
  from: Date;
  days: number;
  map?: DateTransformer;
}): ReturnType<DateTransformer>[] => {
  const weekEndDate = new Date(date);
  const transformer = map || DEFAULT_DATE_TRANSFORMER;

  return Array.from({ length: days }).map((_, index) => {
    weekEndDate.setDate(weekEndDate.getDate() - Number(index > 0));

    return transformer(weekEndDate);
  });
};

export const getDatesWeekSundayDate = (date: Date = new Date()) => {
  date.setDate(date.getDate() + date.getDay());

  return date;
};

export const presentHoursOrMinutesFromMinutes = (minutes: number) => {
  if (minutes < 60) {
    return `${minutes.toFixed(0)}m`;
  }

  const hours = Math.floor(minutes / 60);
  const hoursRounded = Math.round(minutes / 60);

  if (hoursRounded === hours) {
    return `${hoursRounded}h`;
  }

  return `${hoursRounded - 0.5}h`;
};

export const today = () => new Date();
export const yesterday = () => {
  const date = new Date();
  date.setDate(date.getDate() - 1);

  return date;
};
export const tomorrow = () => {
  const date = new Date();
  date.setDate(date.getDate() + 1);

  return date;
};

export const daysAgo = (date: Date, days: number) => {
  const daysAgoDate = new Date(date);
  daysAgoDate.setDate(daysAgoDate.getDate() - days);

  return daysAgoDate;
};

export const weeksBefore = (date: Date, weeks: number) => {
  const weeksBeforeDate = new Date(date);
  weeksBeforeDate.setDate(weeksBeforeDate.getDate() - weeks * 7);

  return weeksBeforeDate;
};

export class PredefinedIsoDates {
  static today = getIsoDate(today());
  static yesterday = getIsoDate(yesterday());
  static tomorrow = getIsoDate(tomorrow());
  static lastWeek = getIsoDate(weeksBefore(today(), 1));
  static lastMonth = getIsoDate(daysAgo(today(), 30));
}
