import {
  ActiveTabListenerVisitor,
  ActivityStartEventListener,
  InactivityStartEventListener,
} from '../tracking/activity.tracker';


const combineListeners = <T extends (...args: any[]) => any>(
  ...listeners: T[]
) => {
  return (...args: Parameters<T>) => {
    const finishEvents = listeners.map((listener) => listener(...args));

    return (...args: Parameters<ReturnType<T>>) => {
      finishEvents.forEach((event) => event(...args));
    };
  };
};

export const combineActivityControllers = (
  ...controllers: ActiveTabListenerVisitor[]
) => {
  return new (class ActivityControllerProxy implements ActiveTabListenerVisitor {
    onActivityStart: ActivityStartEventListener = combineListeners(
      ...controllers.map((c) => c.onActivityStart)
    );
    onInactivityStart: InactivityStartEventListener = combineListeners(
      ...controllers.map((c) => c.onInactivityStart)
    );
  })();
};
