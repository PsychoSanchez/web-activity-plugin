export function throwRuntimeLastError() {
  const error = chrome.runtime.lastError;
  if (error?.message) {
    throw new Error(error.message);
  }
}

export function isTabNotExistError(error: unknown): error is Error {
  return (
    error instanceof Error &&
    error.message.toLowerCase().startsWith('no tab with id')
  );
}

export function isCouldNotEstablishConnectionError(
  error: unknown,
): error is Error {
  return (
    error instanceof Error &&
    error.message.toLowerCase().startsWith('could not establish connection')
  );
}

export function isUserDraggingWindowError(error: unknown): error is Error {
  return (
    error instanceof Error &&
    error.message.toLowerCase().indexOf('user may be dragging a tab') > -1
  );
}

export function isExtensionContextInvalidatedError(
  error: unknown,
): error is Error {
  return (
    error instanceof Error &&
    error.message.toLowerCase().indexOf('extension context invalidated') > -1
  );
}
