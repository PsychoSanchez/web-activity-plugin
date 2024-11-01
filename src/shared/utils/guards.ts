export function assert<T>(
  condition: T | null | undefined,
  message?: string,
): asserts condition {
  if (!condition) {
    throw new Error(message ?? 'Assertion failed');
  }
}

export function isString(value: unknown): value is string {
  return typeof value === 'string';
}
