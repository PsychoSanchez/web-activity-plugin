import * as React from 'react';
import { twMerge } from 'tailwind-merge';

interface PanelComponentClassNameProps {
  className?: string;
}

export const Panel: React.FC<PanelComponentClassNameProps> = ({
  children,
  className,
}) => {
  return (
    <div
      className={twMerge(
        'mb-2 border border-solid border-neutral-100 rounded-2xl p-4 bg-white dark:bg-neutral-800 dark:border-neutral-700',
        className,
      )}
    >
      {children}
    </div>
  );
};

export const PanelHeader: React.FC<PanelComponentClassNameProps> = ({
  children,
  className,
}) => {
  return (
    <h2
      className={twMerge(
        'text-base font-medium pb-1 text-neutral-900 dark:text-neutral-200',
        className,
      )}
    >
      {children}
    </h2>
  );
};

export const PanelBody: React.FC<PanelComponentClassNameProps> = ({
  children,
  className,
}) => {
  return (
    <div className={twMerge('dark:text-neutral-200', className)}>
      {children}
    </div>
  );
};
