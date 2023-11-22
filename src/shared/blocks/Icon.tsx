import * as React from 'react';
import { twMerge } from 'tailwind-merge';

export enum IconType {
  TimeCheck = 'fi-rr-time-check',
  TimePast = 'fi-rr-time-past',
  CalendarClock = 'fi-rr-calendar-clock',
  CalendarLinesPen = 'fi-rr-calendar-lines-pen',
  ChartHistogram = 'fi-rr-chart-histogram',
  ChartPieAlt = 'fi-rr-chart-pie-alt',
  LeftArrow = 'fi-rr-arrow-left',
  RightArrow = 'fi-rr-arrow-right',
  BurgerMenu = 'fi-rr-menu-burger',
  CloudDownload = 'fi-rr-cloud-download-alt',
  CloudUpload = 'fi-rr-cloud-upload-alt',
  Moon = 'fi-rr-moon-stars',
  Sun = 'fi-rr-sun',
  Eclipse = 'fi-rr-eclipse',
  Close = 'fi-rr-cross-circle',
  Eye = 'fi-rr-eye',
  Globe = 'fi-rr-globe',
}

export interface IconProps {
  className?: string;
  onClick?: () => void;
  type: IconType;
}

export const Icon: React.FC<IconProps> = ({ className, type, onClick }) => {
  return (
    <i
      className={twMerge('mr-1 text-sm fi', type, className)}
      onClick={onClick}
    />
  );
};
