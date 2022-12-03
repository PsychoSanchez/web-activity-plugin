const SECOND_IN_MS = 1000;
const MINUTE_IN_MS = 60 * SECOND_IN_MS;
const HOUR_IN_MS = 60 * MINUTE_IN_MS;
const DAY_IN_MS = 24 * HOUR_IN_MS;

export const getIsoDate = (date: Date = new Date()) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  const isoDate = `${year}-${month}-${day}`;

  return isoDate;
};

export const getMinutesInMs = (number: number) => number * MINUTE_IN_MS;
export const getHoursInMs = (number: number) => number * HOUR_IN_MS;
export const getDaysInMs = (number: number) => number * DAY_IN_MS;

export const getTimeFromMs = (number: number) => {
  const seconds = Math.floor((number / SECOND_IN_MS) % 60);
  const minutes = Math.floor((number / MINUTE_IN_MS) % 60);
  const hours = Math.floor((number / HOUR_IN_MS) % 24);

  const presentedHours = hours > 0 ? `${hours}h` : '';
  const presentedMinutes = minutes > 0 ? `${minutes}m` : '';
  const presentedSeconds = `${seconds}s`;

  return [presentedHours, presentedMinutes, presentedSeconds]
    .filter(Boolean)
    .join(' ');
};

export const getTimeWithoutSeconds = (number: number) => {
  const minutes = Math.floor((number / MINUTE_IN_MS) % 60);
  const hours = Math.floor((number / HOUR_IN_MS) % 24);
  const days = Math.floor((number / DAY_IN_MS) % 31);

  const presentedDays = days > 0 ? `${days}d` : '';
  const presentedHours = hours > 0 ? `${hours}h` : '';
  const presentedMinutes = hours > 0 && minutes === 0 ? '' : `${minutes}m`;

  return [presentedDays, presentedHours, presentedMinutes]
    .filter(Boolean)
    .join(' ');
};

export const get7DaysPriorDate = <
  T extends (date: Date) => any = (date: Date) => Date
>(
  date: Date,
  map?: T
): ReturnType<T>[] => {
  const defaultMap = (date: Date) => new Date(date);
  const weekEndDate = new Date(date);

  return new Array(7).fill(0).map((_, index) => {
    weekEndDate.setDate(weekEndDate.getDate() - Number(index > 0));

    return map?.(weekEndDate) ?? defaultMap(weekEndDate);
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
