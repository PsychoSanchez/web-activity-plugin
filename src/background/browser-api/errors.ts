export function isTabNotExistError(error: unknown): error is Error {
  return error instanceof Error && error.message.startsWith('No tab with id:');
}

export function isUserDraggingWindowError(error: unknown): error is Error {
  return (
    error instanceof Error &&
    error.message.indexOf('user may be dragging a tab') > -1
  );
}

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
