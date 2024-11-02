import { assertIsValidHostname } from '@shared/utils/url';

describe('Domains', () => {
  describe('assertIsValidHostname', () => {
    it('should throw an error if domain is not valid', () => {
      expect(() => assertIsValidHostname('')).toThrowError();
      expect(() => assertIsValidHostname(' ')).toThrowError();
      expect(() => assertIsValidHostname('example')).toThrowError();
      expect(() => assertIsValidHostname('http://example.com')).toThrowError();
      expect(() => assertIsValidHostname('https://example.com')).toThrowError();
      expect(() =>
        assertIsValidHostname('http://www.example.com'),
      ).toThrowError();
      expect(() =>
        assertIsValidHostname('https://www.example.com'),
      ).toThrowError();
    });

    it('should not throw an error if domain is valid', () => {
      expect(() => assertIsValidHostname('example.com')).not.toThrowError();
      expect(() => assertIsValidHostname('example.co.uk')).not.toThrowError();
      expect(() => assertIsValidHostname('example.org')).not.toThrowError();
      expect(() => assertIsValidHostname('example.net')).not.toThrowError();
      expect(() => assertIsValidHostname('example.io')).not.toThrowError();
      expect(() => assertIsValidHostname('example.xyz')).not.toThrowError();
    });
  });
});
