import React, { useCallback } from 'react';

import { Skeleton } from '@shared/ui/skeleton';
import { cn } from '@shared/utils';

import { usePopupContext } from '@popup/hooks/PopupContext';

export const AppLoadingSkeleton = ({
  className,
  isVisible,
}: {
  className?: string;
  isVisible: boolean;
}) => {
  const handleTransitionEnd = useCallback(
    (e: React.TransitionEvent<HTMLDivElement>): void => {
      if (e.propertyName === 'opacity') {
        const displayStyle = e.currentTarget.classList.contains('opacity-0')
          ? 'none'
          : '';
        e.currentTarget.style.display = displayStyle;
      }
    },
    [],
  );
  return (
    <div
      className={cn(
        'flex flex-col gap-2 w-full p-2 bg-background absolute top-0 transition-opacity duration-300 pointer-events-none overflow-hidden max-h-full',
        className,
        isVisible ? 'opacity-100' : 'opacity-0',
      )}
      onTransitionEnd={handleTransitionEnd}
    >
      <Skeleton className="min-h-10 min-w-32 w-full bg-gray-500/20 dark:bg-gray-500/10" />
      <Skeleton className="min-h-32 min-w-32 w-full bg-gray-500/20 dark:bg-gray-500/10" />
      <Skeleton className="min-h-32 min-w-32 w-full bg-gray-500/20 dark:bg-gray-500/10" />
      <Skeleton className="min-h-48 min-w-32 w-full bg-gray-500/20 dark:bg-gray-500/10" />
      <Skeleton className="min-h-64 min-w-32 w-full bg-gray-500/20 dark:bg-gray-500/10" />
    </div>
  );
};

export const AppLoadingSkeletonWrapper = ({
  children,
}: React.PropsWithChildren) => {
  const { isStoreLoaded } = usePopupContext();

  return (
    <div className="relative">
      {children}
      <AppLoadingSkeleton isVisible={!isStoreLoaded} />
    </div>
  );
};
