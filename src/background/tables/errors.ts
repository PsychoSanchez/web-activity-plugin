export function isKeyAlreadyExistsError(error: unknown): error is Error {
  return (
    error instanceof Error &&
    error.message.toLowerCase().indexOf('key already exists') > -1
  );
}
