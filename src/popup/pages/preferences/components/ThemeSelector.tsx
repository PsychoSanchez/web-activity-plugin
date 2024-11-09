import * as React from 'react';
import { twMerge } from 'tailwind-merge';

import { Button } from '@shared/blocks/Button';
import { Icon, IconType } from '@shared/blocks/Icon';
import { i18n } from '@shared/services/i18n';
import { ColorScheme, ThemeService } from '@shared/services/theme';

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
          className={twMerge(
            'flex-1 rounded-none',
            theme === 'auto' && 'bg-neutral-300 dark:bg-neutral-900',
          )}
        >
          <Icon type={IconType.Eclipse} /> {i18n('ThemeSelector_OptionAuto')}
        </Button>
        <Button
          onClick={handleDarkThemeSelect}
          className={twMerge(
            'flex-1 rounded-none border-l-2 border-r-2 border-solid border-neutral-300 dark:border-neutral-900',
            theme === 'dark' && 'bg-neutral-300 dark:bg-neutral-900',
          )}
        >
          <Icon type={IconType.Moon} /> {i18n('ThemeSelector_OptionDark')}
        </Button>
        <Button
          onClick={handleLightThemeSelect}
          className={twMerge(
            'flex-1 rounded-none',
            theme === 'light' && 'bg-neutral-300 dark:bg-neutral-900',
          )}
        >
          <Icon type={IconType.Sun} /> {i18n('ThemeSelector_OptionLight')}
        </Button>
      </div>
    </div>
  );
};
