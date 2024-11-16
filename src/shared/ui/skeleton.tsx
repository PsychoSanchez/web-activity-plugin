import React from 'react';

import { cn } from '@shared/utils';

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-primary/10', className)}
      {...props}
    />
  );
}

function SkeletonStatic({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('rounded-md bg-primary/50', className)} {...props} />
  );
}

export { Skeleton, SkeletonStatic };
