import { Eclipse, Moon, Sun } from 'lucide-react';
import * as React from 'react';

import { i18n } from '@shared/services/i18n';
import { ColorScheme, ThemeService } from '@shared/services/theme';
import { Button } from '@shared/ui/button';

export const ThemeSelector = () => {
  const [theme, setTheme] = React.useState(() => ThemeService.getAppTheme());

  const handleThemeChange = React.useCallback((theme: ColorScheme) => {
    ThemeService.setAppTheme(theme);
    setTheme(theme);
  }, []);

  const handleDarkThemeSelect = React.useCallback(
    () => handleThemeChange(ColorScheme.Dark),
    [handleThemeChange],
  );

  const handleLightThemeSelect = React.useCallback(
    () => handleThemeChange(ColorScheme.Light),
    [handleThemeChange],
  );

  const handleAutoThemeSelect = React.useCallback(
    () => handleThemeChange(ColorScheme.SwitchByTime),
    [handleThemeChange],
  );

  return (
    <div className="flex flex-col gap-1">
      <label>{i18n('ThemeSelector_Header')}</label>
      <div className="flex flex-row rounded-lg border-2 border-solid border-neutral-300 dark:border-neutral-900 overflow-hidden">
        <Button
          onClick={handleAutoThemeSelect}
          className="flex-1"
          variant={theme === 'auto' ? 'default' : 'secondary'}
        >
          <Eclipse size={16} className="mr-1" />
          {i18n('ThemeSelector_OptionAuto')}
        </Button>
        <Button
          onClick={handleDarkThemeSelect}
          className="flex-1"
          variant={theme === 'dark' ? 'default' : 'secondary'}
        >
          <Moon size={16} className="mr-1" />
          {i18n('ThemeSelector_OptionDark')}
        </Button>
        <Button
          onClick={handleLightThemeSelect}
          className="flex-1"
          variant={theme === 'light' ? 'default' : 'secondary'}
        >
          <Sun size={16} className="mr-1" />
          {i18n('ThemeSelector_OptionLight')}
        </Button>
      </div>
    </div>
  );
};
