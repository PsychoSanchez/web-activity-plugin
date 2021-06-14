import {
  ActivityEventListener,
  InactivityEventListener,
} from '../tracking/activity.tracker';

export interface ActivityController {
  onActivityStart: ActivityEventListener;
  onInactivityStart: InactivityEventListener;
}
