import * as React from 'react';

import { AppStore } from '../../hooks/useTimeStore';

import { OverallActivityCalendarPanel } from '../OverallActivityCalendar/OverallActiivtyCalendar';

export interface OverallPageProps {
  store: AppStore;
  onNavigateToActivityPage: React.ComponentProps<
    typeof OverallActivityCalendarPanel
  >['navigateToDateActivityPage'];
}
