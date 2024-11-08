import { formatI18NMessage } from '../i18n';

describe('formatI18NMessage', () => {
  test('should format empty message', () => {
    expect(formatI18NMessage('', {})).toBe('');
  });

  test('should format message without placeholders', () => {
    expect(formatI18NMessage('Hello, world!', {})).toBe('Hello, world!');
  });

  test('should format message with placeholders', () => {
    expect(formatI18NMessage('Hello, $name$', { name: 'world' })).toBe(
      'Hello, world',
    );
  });

  test('should format message with multiple placeholders', () => {
    expect(
      formatI18NMessage('Hello, $name$, $greeting$', {
        name: 'world',
        greeting: 'good morning',
      }),
    ).toBe('Hello, world, good morning');
  });

  test('should format message with missing placeholders', () => {
    expect(formatI18NMessage('Hello, $name$', {})).toBe('Hello, undefined');
  });

  test('should format message with missing placeholders', () => {
    expect(formatI18NMessage('Hello, $name$', { greeting: 'world' })).toBe(
      'Hello, undefined',
    );
  });
});
