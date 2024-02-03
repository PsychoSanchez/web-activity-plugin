type Themes = 'light' | 'dark' | 'auto';

let theme: Themes = (localStorage.getItem('theme') as any) || 'light';

export const useTheme = () => {
  return theme;
};

export const getAppTheme = () => {
  return theme;
};

export const useIsDarkMode = () => {
  if (theme === 'auto') {
    // Enable dark mode between 8pm and 8am local time
    updateAutoTheme();
    return isTimeForDarkMode();
  }

  return theme === 'dark';
};

export const setAppTheme = (newTheme: Themes) => {
  theme = newTheme;

  localStorage.setItem('theme', newTheme);

  ['light', 'dark', 'auto'].forEach((t) => {
    document.body.classList.remove(t);
  });

  updateAutoTheme();
};

export const initTheme = () => {
  const storedTheme = localStorage.getItem('theme');

  const theme = storedTheme || getDefaultPreferredTheme();

  setAppTheme(theme as Themes);
};

function updateAutoTheme() {
  document.body.classList.add(
    theme === 'auto' ? (isTimeForDarkMode() ? 'dark' : 'light') : theme,
  );
}

function getDefaultPreferredTheme(): string {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'auto';
}

function isTimeForDarkMode() {
  const date = new Date();
  const hours = date.getHours();

  return hours >= 20 || hours <= 8;
}
