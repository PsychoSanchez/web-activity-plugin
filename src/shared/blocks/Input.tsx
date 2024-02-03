import * as React from 'react';
import { twMerge } from 'tailwind-merge';

export const TextArea: React.FC<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
> = ({ className, ...props }) => {
  return (
    <textarea
      {...props}
      className={twMerge(
        'p-2 w-full resize-none rounded-lg outline-none border-2 border-solid bg-white text-neutral-800 border-neutral-300 focus:border-neutral-500 dark:bg-neutral-900 dark:text-neutral-200 dark:border-neutral-900 dark:focus:border-neutral-300',
        className,
      )}
    />
  );
};

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({
  className,
  ...props
}) => {
  return (
    <input
      {...props}
      className={twMerge(
        'p-2 w-full rounded-lg outline-none border-2 border-solid bg-white text-neutral-800 border-neutral-300 focus:border-neutral-500 dark:bg-neutral-900 dark:text-neutral-200 dark:border-neutral-900 dark:focus:border-neutral-300',
        className,
      )}
    />
  );
};

export const Checkbox = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <input
      {...props}
      ref={ref}
      type="checkbox"
      className={twMerge(
        'cursor-pointer w-4 h-4 text-blue-400 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600 outline-hidden',
        className,
      )}
    />
  );
});

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
