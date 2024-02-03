import { TimeStore } from '../db/types';

export const mergeTimeStore = (
  storeA: TimeStore = {},
  storeB: TimeStore = {},
): TimeStore => {
  const storeAKeys = Object.keys(storeA ?? {});
  const storeBKeys = Object.keys(storeB ?? {});

  const allKeys = Array.from(new Set([...storeAKeys, ...storeBKeys]));

  return allKeys.reduce((acc, key) => {
    const storeAValue = storeA[key];
    const storeBValue = storeB[key];

    acc[key] = {
      ...storeAValue,
      ...storeBValue,
      ...Object.keys({ ...storeAValue, ...storeBValue }).reduce(
        (acc, key) => {
          const storeAValueForKey =
            storeAValue?.[key] || storeBValue?.[key] || 0;
          const storeBValueForKey =
            storeBValue?.[key] || storeAValue?.[key] || 0;

          acc[key] = Math.max(storeAValueForKey, storeBValueForKey);

          return acc;
        },
        {} as Record<string, number>,
      ),
    };

    return acc;
  }, {} as TimeStore);
};
