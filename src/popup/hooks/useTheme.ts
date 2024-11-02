import * as React from 'react';

import { ColorScheme, ThemeService } from '@shared/services/theme';

export const useIsDarkMode = () => {
  const theme = React.useMemo(() => ThemeService.getAppTheme(), []);
  if (theme === ColorScheme.SwitchByTime) {
    return ThemeService.isTimeForDarkMode();
  }

  return theme === ColorScheme.Dark;
};

export const initTheme = () => ThemeService.initTheme();
