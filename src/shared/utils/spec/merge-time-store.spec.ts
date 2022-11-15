import { mergeTimeStore } from '../merge-time-store';

describe('mergeTimeStore', () => {
  it('should merge keys of two time stores', () => {
    const storeA = {
      '2020-01-01': 1,
      '2020-01-02': 2,
    };

    const storeB = {
      '2020-01-01': 1,
      '2020-01-03': 3,
    };

    const expected = {
      '2020-01-01': 1,
      '2020-01-02': 2,
      '2020-01-03': 3,
    };

    expect(mergeTimeStore(storeA, storeB)).toEqual(expected);
  });

  it("should pick the max value of the same key's value", () => {
    const storeA = {
      '2020-01-01': 1,
      '2020-01-02': 2,
    };

    const storeB = {
      '2020-01-01': 2,
      '2020-01-02': 1,
    };

    const expected = {
      '2020-01-01': 2,
      '2020-01-02': 2,
    };

    expect(mergeTimeStore(storeA, storeB)).toEqual(expected);
  });

  it('should merge nested time stores', () => {
    const storeA = {
      '2020-01-01': {
        'www.google.com': 1,
        'www.facebook.com': 2,
      },
      '2020-01-02': 2,
    };

    const storeB = {
      '2020-01-01': {
        'www.google.com': 1,
        'www.facebook.com': 3,
      },
      '2020-01-03': 3,
    };

    const expected = {
      '2020-01-01': {
        'www.google.com': 1,
        'www.facebook.com': 3,
      },
      '2020-01-02': 2,
      '2020-01-03': 3,
    };

    expect(mergeTimeStore(storeA, storeB)).toEqual(expected);
  });

  it("tests if types of the same key mismatch, then should pick value from first store's key", () => {
    const storeA = {
      '2020-01-01': 1,
      '2020-01-02': 2,
    };

    const storeB = {
      '2020-01-01': {
        'www.google.com': 1,
        'www.facebook.com': 3,
      },
      '2020-01-03': 3,
    };

    const expected = {
      '2020-01-01': 1,
      '2020-01-02': 2,
      '2020-01-03': 3,
    };

    expect(mergeTimeStore(storeA, storeB)).toEqual(expected);
  });
});
