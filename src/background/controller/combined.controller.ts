import {
  ActivityEventListener,
  InactivityEventListener,
} from '../tracking/activity.tracker';

import { ActivityController } from './types';

const combineListeners = <T extends (...args: any[]) => any>(
  listeners: T[]
) => {
  return (...args: Parameters<T>) => {
    const finishEvents = listeners.map((listener) => listener(...args));

    return (...args: Parameters<ReturnType<T>>) => {
      finishEvents.forEach((event) => event(...args));
    };
  };
};

export const combineActivityControllers = (
  ...controllers: ActivityController[]
) => {
  return new (class ActivityControllerProxy implements ActivityController {
    onActivityStart: ActivityEventListener = combineListeners(
      controllers.map((c) => c.onActivityStart)
    );
    onInactivityStart: InactivityEventListener = combineListeners(
      controllers.map((c) => c.onInactivityStart)
    );
  })();
};
