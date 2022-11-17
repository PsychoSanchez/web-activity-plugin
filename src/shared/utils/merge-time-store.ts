import { TimeStore } from '../db/types';

export const mergeTimeStore = (
  storeA: TimeStore,
  storeB: TimeStore
): TimeStore => {
  const storeAKeys = Object.keys(storeA);
  const storeBKeys = Object.keys(storeB);

  const keys = Array.from(new Set([...storeAKeys, ...storeBKeys]));

  return keys.reduce((acc, key) => {
    const storeAValue = storeA[key];
    const storeBValue = storeB[key];

    if (storeAValue && storeBValue) {
      acc[key] = {
        ...storeAValue,
        ...storeBValue,
        ...Object.keys(storeAValue).reduce((acc, key) => {
          const storeAValueForKey = storeAValue[key] || storeBValue[key];
          const storeBValueForKey = storeBValue[key] || storeAValue[key];

          acc[key] = Math.max(storeAValueForKey, storeBValueForKey);

          return acc;
        }, {} as Record<string, number>),
      };
    } else {
      acc[key] = storeAValue || storeBValue || {};
    }

    return acc;
  }, {} as TimeStore);
};
