export function ignore<T extends Array<(error: unknown) => error is Error>>(
  ...handlers: T
): (error: unknown) => null {
  return (error: unknown) => {
    if (handlers.some((handler) => handler(error))) {
      return null;
    }

    throw error;
  };
}

export const throwIfNot = ignore;
