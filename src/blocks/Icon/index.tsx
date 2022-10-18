import * as React from 'react';
import { twMerge } from 'tailwind-merge';

export enum IconType {
  TimeCheck = 'fi-rr-time-check',
  TimePast = 'fi-rr-time-past',
  CalendarClock = 'fi-rr-calendar-clock',
  ChartHistogram = 'fi-rr-chart-histogram',
  ChartPieAlt = 'fi-rr-chart-pie-alt',
  LeftArrow = 'fi-rr-arrow-left',
  RightArrow = 'fi-rr-arrow-right',
}

export interface IconProps {
  className?: string;
  type: IconType;
}

export const Icon: React.FC<IconProps> = ({ className, type }) => {
  return <i className={twMerge('mr-1 text-sm fi', type, className)} />;
};
