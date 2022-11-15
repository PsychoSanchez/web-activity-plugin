import { TimeStore } from '../db/types';

export const mergeTimeStore = (storeA: TimeStore, storeB: TimeStore): TimeStore => {
  const storeAKeys = Object.keys(storeA);
  const storeBKeys = Object.keys(storeB);

  const keys = Array.from(new Set([...storeAKeys, ...storeBKeys]));

  return keys.reduce((res, key) => {
    const valA = storeA[key] || 0;
    const valB = storeB[key] || 0;

    if (typeof valA === 'object' && typeof valB === 'object') {
      res[key] = mergeTimeStore(valA, valB) as any;
      return res;
    }

    if (typeof valA === 'number' && typeof valB === 'number') {
      res[key] = Math.max(valA, valB);
      return res;
    }

    res[key] = storeA[key] || storeB[key];

    return res;
  }, {} as TimeStore);
};
