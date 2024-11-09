import * as React from 'react';
import { twMerge } from 'tailwind-merge';

export const Time = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <input
      {...props}
      ref={ref}
      type="time"
      className={twMerge(
        'p-2 w-full rounded-lg outline-none border-2 border-solid bg-white text-neutral-800 border-neutral-300 focus:border-neutral-500 dark:bg-neutral-900 dark:text-neutral-200 dark:border-neutral-900 dark:focus:border-neutral-300',
        className,
      )}
    />
  );
});
