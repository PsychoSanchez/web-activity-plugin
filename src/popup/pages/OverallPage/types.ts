import * as React from 'react';

import { AppStore } from '../../../hooks/useTimeStore';

import { OverallActivityCalendarPanel } from '../../../components/OverallActivityCalendar/OverallActivtyCalendar';

export interface OverallPageProps {
  store: AppStore;
  onNavigateToActivityPage: React.ComponentProps<
    typeof OverallActivityCalendarPanel
  >['navigateToDateActivityPage'];
}
