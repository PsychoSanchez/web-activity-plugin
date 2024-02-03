import {
  getIsoDate,
  getMinutesInMs,
  getHoursInMs,
  getDaysInMs,
  getTimeFromMs,
  getTimeWithoutSeconds,
  get7DaysPriorDate,
  getDatesWeekSundayDate,
} from '../dates-helper';

describe('getIsoDate', () => {
  it('should return a string in the format YYYY-MM-DD', () => {
    const date = new Date('2020-01-01T00:00:00.000Z');

    expect(getIsoDate(date)).toBe('2020-01-01');
  });
});

describe('getMinutesInMs', () => {
  it('should return the number of minutes in milliseconds', () => {
    expect(getMinutesInMs(1)).toBe(60000);
    expect(getMinutesInMs(2)).toBe(120000);
    expect(getMinutesInMs(3)).toBe(180000);
  });
});

describe('getHoursInMs', () => {
  it('should return the number of hours in milliseconds', () => {
    expect(getHoursInMs(1)).toBe(3600000);
    expect(getHoursInMs(2)).toBe(7200000);
    expect(getHoursInMs(3)).toBe(10800000);
  });
});

describe('getDaysInMs', () => {
  it('should return the number of days in milliseconds', () => {
    expect(getDaysInMs(1)).toBe(86400000);
    expect(getDaysInMs(2)).toBe(172800000);
    expect(getDaysInMs(3)).toBe(259200000);
  });
});

describe('getTimeFromMs', () => {
  it('should return the number of seconds in milliseconds', () => {
    expect(getTimeFromMs(1000)).toBe('1s');
    expect(getTimeFromMs(2000)).toBe('2s');
    expect(getTimeFromMs(3000)).toBe('3s');
  });

  it('should return the number of minutes in milliseconds', () => {
    expect(getTimeFromMs(60000)).toBe('1m 0s');
    expect(getTimeFromMs(120000)).toBe('2m 0s');
    expect(getTimeFromMs(180000)).toBe('3m 0s');
  });

  it('should return the number of hours in milliseconds', () => {
    expect(getTimeFromMs(3600000)).toBe('1h 0s');
    expect(getTimeFromMs(7200000)).toBe('2h 0s');
    expect(getTimeFromMs(10800000)).toBe('3h 0s');
  });

  // it('should overflow for hours bigger than 24', () => {
  //   expect(getTimeFromMs(getDaysInMs(1))).toBe('1d 0s');
  //   expect(getTimeFromMs(getDaysInMs(2))).toBe('2d 0s');
  //   expect(getTimeFromMs(getDaysInMs(3))).toBe('3d 0s');
  // });

  it('should return hours, minutes and seconds in milliseconds', () => {
    expect(getTimeFromMs(3661000)).toBe('1h 1m 1s');
    expect(getTimeFromMs(7322000)).toBe('2h 2m 2s');
    expect(getTimeFromMs(10983000)).toBe('3h 3m 3s');
  });
});

describe('getTimeWithoutSeconds', () => {
  it('should return the number of minutes in milliseconds', () => {
    expect(getTimeWithoutSeconds(60000)).toBe('1m');
    expect(getTimeWithoutSeconds(120000)).toBe('2m');
    expect(getTimeWithoutSeconds(180000)).toBe('3m');
  });

  it('should return the number of hours in milliseconds', () => {
    expect(getTimeWithoutSeconds(3600000)).toBe('1h');
    expect(getTimeWithoutSeconds(7200000)).toBe('2h');
    expect(getTimeWithoutSeconds(10800000)).toBe('3h');
  });

  it('should return the number of days', () => {
    expect(getTimeWithoutSeconds(getDaysInMs(1))).toBe('1d 0m');
    expect(getTimeWithoutSeconds(getDaysInMs(2))).toBe('2d 0m');
    expect(getTimeWithoutSeconds(getDaysInMs(3))).toBe('3d 0m');
  });

  // it('should overflow after 31 days', () => {
  //   expect(getTimeWithoutSeconds(getDaysInMs(32))).toBe('1d 0m');
  //   expect(getTimeWithoutSeconds(getDaysInMs(33))).toBe('2d 0m');
  //   expect(getTimeWithoutSeconds(getDaysInMs(34))).toBe('3d 0m');
  // });

  it('should return hours and minutes in milliseconds', () => {
    expect(getTimeWithoutSeconds(3661000)).toBe('1h 1m');
    expect(getTimeWithoutSeconds(7322000)).toBe('2h 2m');
    expect(getTimeWithoutSeconds(10983000)).toBe('3h 3m');
  });
});

describe('get7DaysPriorDate', () => {
  it('should return an array of 7 dates', () => {
    const date = new Date('2020-01-01T00:00:00.000Z');

    expect(get7DaysPriorDate(date)).toHaveLength(7);
  });

  it('should return an array of 7 dates starting from the given date', () => {
    const date = new Date('2020-01-01T00:00:00.000Z');

    expect(get7DaysPriorDate(date)[0]).toEqual(date);
    expect(get7DaysPriorDate(date)[6]).toEqual(
      new Date('2019-12-26T00:00:00.000Z'),
    );
  });
});

describe('getDatesWeekSundayDate', () => {
  it('should return the date of the Sunday of the week of the given date', () => {
    const date = new Date('2020-01-01T00:00:00.000Z');

    expect(getDatesWeekSundayDate(date)).toEqual(
      new Date('2020-01-04T00:00:00.000Z'),
    );
  });
});
