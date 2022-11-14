import { ActiveTabState } from '../storage/timelines';

export type FinishTrackingEventHandler = (timestamp: number) => void;

export type InactivityStartEventListener = (
  timestamp: number
) => FinishTrackingEventHandler;

export type ActivityStartEventListener = (
  tab: chrome.tabs.Tab,
  timestamp: number
) => FinishTrackingEventHandler;

export interface ActiveTabListenerVisitor {
  onActivityStart: ActivityStartEventListener;
  onInactivityStart: InactivityStartEventListener;
}

const isInvalidUrl = (url: string | undefined): url is undefined => {
  return (
    !url ||
    ['chrome', 'about', 'opera', 'edge', 'coccoc', 'yabro'].some((broName) =>
      url.startsWith(broName)
    )
  );
};

export class ActiveTabListener {
  private invokeActivityFinishEvent: FinishTrackingEventHandler = () => {};

  constructor(private visitor: ActiveTabListenerVisitor) {}

  handleStateChange(
    tabState: ActiveTabState,
    eventTimestamp: number = Date.now()
  ) {
    this.invokeActivityFinishEvent(eventTimestamp);

    this.invokeActivityFinishEvent = this.invokeNewActivityStartEvent(
      tabState,
      eventTimestamp
    );
  }

  private invokeNewActivityStartEvent(
    activeTabState: ActiveTabState,
    timestamp: number
  ): FinishTrackingEventHandler {
    console.log('New State', activeTabState);

    const activeTabUrl = activeTabState.focusedActiveTab?.url;

    if (
      activeTabState.idleState === 'locked' ||
      !activeTabState.focusedActiveTab ||
      isInvalidUrl(activeTabUrl)
    ) {
      return this.visitor.onInactivityStart(timestamp);
    }

    const { focusedActiveTab } = activeTabState;

    if (activeTabState.idleState === 'idle') {
      return focusedActiveTab.audible
        ? this.visitor.onActivityStart(focusedActiveTab, timestamp)
        : this.visitor.onInactivityStart(timestamp);
    }

    return this.visitor.onActivityStart(focusedActiveTab, timestamp);
  }
}
