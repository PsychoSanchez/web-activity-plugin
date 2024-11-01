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
