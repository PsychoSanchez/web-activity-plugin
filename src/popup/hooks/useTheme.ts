type Themes = 'light' | 'dark' | 'auto';

let theme: Themes = (localStorage.getItem('theme') as any) || 'light';

export const useTheme = () => {
  return theme;
};

export const useIsDarkMode = () => {
  if (theme === 'auto') {
    // Enable dark mode between 8pm and 8am local time
    return isTimeForDarkMode();
  }

  return theme === 'dark';
};

export const setTheme = (newTheme: Themes) => {
  theme = newTheme;

  localStorage.setItem('theme', newTheme);
};

export const initTheme = () => {
  const storedTheme = localStorage.getItem('theme');

  const theme =
    storedTheme ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'auto');

  if (theme) {
    document.body.classList.add(
      theme === 'auto' ? (isTimeForDarkMode() ? 'dark' : 'light') : theme
    );
  }

  setTheme(theme as any);
};

function isTimeForDarkMode() {
  const date = new Date();
  const hours = date.getHours();

  return hours >= 20 || hours <= 8;
}
