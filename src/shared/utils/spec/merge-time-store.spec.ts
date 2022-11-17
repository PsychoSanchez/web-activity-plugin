import { mergeTimeStore } from '../merge-time-store';

describe('mergeTimeStore', () => {
  it('should merge keys of two time stores', () => {
    const storeA = {
      '2020-01-02': {
        'www.google.com': 3000,
        'www.facebook.com': 4000,
      },
    };

    const storeB = {
      '2020-01-01': {
        'www.google.com': 5000,
        'www.facebook.com': 6000,
      },
    };

    expect(mergeTimeStore(storeA, storeB)).toEqual({
      ...storeA,
      ...storeB,
    });
  });

  it("should pick the max value of the same key's value", () => {
    const storeA = {
      '2020-01-01': {
        'www.google.com': 5000,
        'www.facebook.com': 6000,
      },
    };

    const storeB = {
      '2020-01-01': {
        'www.google.com': 3000,
        'www.facebook.com': 8000,
      },
    };

    const expected = {
      '2020-01-01': {
        'www.google.com': 5000,
        'www.facebook.com': 8000,
      },
    };

    expect(mergeTimeStore(storeA, storeB)).toEqual(expected);
  });

  it('should merge time stores', () => {
    const storeA = {
      '2020-01-01': {
        'www.google.com': 1,
        'www.facebook.com': 2,
      },
      '2020-01-02': {
        'www.google.com': 3,
        'www.facebook.com': 4,
      },
    };

    const storeB = {
      '2020-01-01': {
        'www.google.com': 1,
        'www.facebook.com': 3,
      },
      '2020-01-03': {
        'www.google.com': 5,
        'www.facebook.com': 6,
      },
    };

    const expected = {
      '2020-01-01': {
        'www.google.com': 1,
        'www.facebook.com': 3,
      },
      '2020-01-02': {
        'www.google.com': 3,
        'www.facebook.com': 4,
      },
      '2020-01-03': {
        'www.google.com': 5,
        'www.facebook.com': 6,
      },
    };

    expect(mergeTimeStore(storeA, storeB)).toEqual(expected);
  });
});
