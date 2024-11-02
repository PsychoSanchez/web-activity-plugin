import { assert } from './guards';

export const getHostNameFromUrl = (url: string) => {
  const { hostname } = new URL(url);

  return hostname || url;
};

const BROWSER_URL_PREFIX = [
  'chrome',
  'about',
  'opera',
  'edge',
  'coccoc',
  'yabro',
];

export const isInvalidUrl = (url: string | undefined): url is undefined => {
  return !url || BROWSER_URL_PREFIX.some((broName) => url.startsWith(broName));
};

// Validate that domain is valid (example.com)
const DOMAIN_REGEX = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/;

export type Domain = string & { readonly __domain: unique symbol };

export function assertIsValidHostname(
  domain?: string,
): asserts domain is Domain {
  // Validate domain
  assert(domain, 'Domain is required');
  assert(DOMAIN_REGEX.test(domain), 'Domain is invalid');
}
