import * as React from 'react';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  buttonType?: ButtonType;
}

export enum ButtonType {
  Primary,
  Secondary,
}

export const Button: React.FC<ButtonProps> = ({
  className,
  buttonType,
  children,
  ...props
}) => (
  <button
    className={twMerge(
      'transition-colors duration-300 cursor-pointer bg-none border-none text-sm font-medium rounded-xl px-6 py-3',
      buttonType === ButtonType.Primary &&
        'text-neutral-100 bg-neutral-800 hover:bg-neutral-900 dark:text-neutral-800 dark:bg-neutral-200 dark:hover:bg-neutral-300',
      buttonType === ButtonType.Secondary &&
        'text-neutral-800 bg-neutral-300 hover:bg-neutral-400 dark:text-neutral-200 dark:bg-neutral-700 dark:hover:bg-neutral-600',
      className,
    )}
    {...props}
  >
    {children}
  </button>
);
