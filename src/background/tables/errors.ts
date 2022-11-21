export function isKeyAlreadyExistsError(error: unknown): error is Error {
  return (
    error instanceof Error &&
    error.message.toLowerCase().indexOf('key already exists') > -1
  );
}

export function isUnableToAddKeyToIndexError(error: unknown): error is Error {
  return (
    error instanceof Error &&
    error.message.toLowerCase().indexOf('unable to add key to index') > -1
  );
}
