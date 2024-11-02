export enum ColorScheme {
  Light = 'light',
  Dark = 'dark',
  SwitchByTime = 'auto',
}

const COLOR_SCHEME_KEY = 'theme';
const COLORS_SCHEMES = Object.values(ColorScheme);

const isColorScheme = (value: string): value is ColorScheme =>
  COLORS_SCHEMES.includes(value as ColorScheme);

function getDefaultPreferredTheme(): ColorScheme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? ColorScheme.Dark
    : ColorScheme.SwitchByTime;
}

function getColorSchemeFromLocalStorage(): ColorScheme {
  const savedTheme = localStorage.getItem(COLOR_SCHEME_KEY);

  return savedTheme && isColorScheme(savedTheme)
    ? savedTheme
    : getDefaultPreferredTheme();
}

// eslint-disable-next-line @typescript-eslint/no-namespace -- we need to use namespace here
export namespace ThemeService {
  let theme: ColorScheme | undefined;

  export const getAppTheme = (): ColorScheme => {
    if (theme) {
      updateDOMClassNames(theme);
      return theme;
    }

    theme = getColorSchemeFromLocalStorage();
    updateDOMClassNames(theme);
    return theme;
  };

  export const setAppTheme = (newTheme: ColorScheme) => {
    theme = newTheme;

    localStorage.setItem(COLOR_SCHEME_KEY, newTheme);

    for (const colorScheme of COLORS_SCHEMES) {
      document.body.classList.remove(colorScheme);
    }

    updateDOMClassNames(theme);
  };

  export const initTheme = () => {
    setAppTheme(getColorSchemeFromLocalStorage());
  };

  // Enable dark mode between 8pm and 8am local time
  export function isTimeForDarkMode() {
    const date = new Date();
    const hours = date.getHours();

    return hours >= 20 || hours <= 8;
  }

  export function updateDOMClassNames(colorScheme: ColorScheme) {
    theme =
      colorScheme === ColorScheme.SwitchByTime
        ? isTimeForDarkMode()
          ? ColorScheme.Dark
          : ColorScheme.Light
        : colorScheme;

    document.body.classList.add(theme);
  }
}
