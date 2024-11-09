import React from 'react';

import { Skeleton } from '@shared/ui/skeleton';

export const AppLoadingSkeleton = () => {
  return (
    <div className="flex flex-col gap-2 w-full p-2">
      <Skeleton className="h-10 min-w-32 w-full bg-gray-500/20 dark:bg-gray-500/10" />
      <Skeleton className="h-32 min-w-32 w-full bg-gray-500/20 dark:bg-gray-500/10" />
      <Skeleton className="h-32 min-w-32 w-full bg-gray-500/20 dark:bg-gray-500/10" />
      <Skeleton className="h-48 min-w-32 w-full bg-gray-500/20 dark:bg-gray-500/10" />
      <Skeleton className="h-64 min-w-32 w-full bg-gray-500/20 dark:bg-gray-500/10" />
    </div>
  );
};
