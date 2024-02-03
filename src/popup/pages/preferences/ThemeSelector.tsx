import * as React from 'react';
import { twMerge } from 'tailwind-merge';

import { Button } from '@shared/blocks/Button';
import { Icon, IconType } from '@shared/blocks/Icon';

import { getAppTheme, setAppTheme } from '../../hooks/useTheme';

export const ThemeSelector: React.FC = () => {
  const [theme, setTheme] = React.useState(getAppTheme());

  const handleThemeChange = React.useCallback(
    (theme: 'light' | 'dark' | 'auto') => {
      setAppTheme(theme);
      setTheme(theme);
    },
    [],
  );

  const handleDarkThemeSelect = React.useCallback(() => {
    handleThemeChange('dark');
  }, [handleThemeChange]);

  const handleLightThemeSelect = React.useCallback(() => {
    handleThemeChange('light');
  }, [handleThemeChange]);

  const handleAutoThemeSelect = React.useCallback(() => {
    handleThemeChange('auto');
  }, [handleThemeChange]);

  return (
    <div className="flex flex-col gap-2">
      <h3>Theme</h3>
      <div className="flex flex-row rounded-lg border-2 border-solid border-neutral-300 dark:border-neutral-900 overflow-hidden">
        <Button
          onClick={handleAutoThemeSelect}
          className={twMerge(
            'flex-1 rounded-none',
            theme === 'auto' && 'bg-neutral-300 dark:bg-neutral-900',
          )}
        >
          <Icon type={IconType.Eclipse} /> Auto
        </Button>
        <Button
          onClick={handleDarkThemeSelect}
          className={twMerge(
            'flex-1 rounded-none border-l-2 border-r-2 border-solid border-neutral-300 dark:border-neutral-900',
            theme === 'dark' && 'bg-neutral-300 dark:bg-neutral-900',
          )}
        >
          <Icon type={IconType.Moon} /> Dark
        </Button>
        <Button
          onClick={handleLightThemeSelect}
          className={twMerge(
            'flex-1 rounded-none',
            theme === 'light' && 'bg-neutral-300 dark:bg-neutral-900',
          )}
        >
          <Icon type={IconType.Sun} /> Light
        </Button>
      </div>
    </div>
  );
};
