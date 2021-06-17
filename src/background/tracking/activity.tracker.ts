import { Tabs } from 'webextension-polyfill-ts';

import { ActivityController } from '../controller/types';

import { ActiveTabState } from './active-tabs.monitor';

type FinishTrackingEventHandler = (timestamp: number) => void;
export type InactivityEventListener = (
  timestamp: number
) => FinishTrackingEventHandler;
export type ActivityEventListener = (
  tab: Tabs.Tab,
  timestamp: number
) => FinishTrackingEventHandler;

const isInvalidUrl = (url: string | undefined): url is undefined => {
  return (
    !url ||
    ['chrome', 'about', 'opera', 'edge', 'coccoc', 'yabro'].some((broName) =>
      url.startsWith(broName)
    )
  );
};

export class ActiveTabTracker {
  private invokeActivityFinishEvent: FinishTrackingEventHandler = () => {};

  constructor(private controller: ActivityController) {}

  handleTabsStateChange(
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
      activeTabState.focusedActiveTab === null ||
      isInvalidUrl(activeTabUrl)
    ) {
      return this.controller.onInactivityStart(timestamp);
    }

    const { focusedActiveTab } = activeTabState;

    if (activeTabState.idleState === 'idle') {
      return focusedActiveTab.audible
        ? this.controller.onActivityStart(focusedActiveTab, timestamp)
        : this.controller.onInactivityStart(timestamp);
    }

    return this.controller.onActivityStart(focusedActiveTab, timestamp);
  }
}
