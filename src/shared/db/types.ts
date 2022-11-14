type Tab = chrome.tabs.Tab;
type IdleState = chrome.idle.IdleState;

export type Store = Record<string, Record<string, number> | number>;

export interface TimelineRecord {
  url: string;
  hostname: string;
  docTitle: string;
  favIconUrl: string | undefined;
  date: string;
  activityPeriodStart: number;
  activityPeriodEnd: number;
}

export type ActiveTabState = {
  activeTabs: Tab[];
  focusedActiveTab?: Tab | null;
  focusedWindowId?: number;
  idleState?: IdleState;
};

export interface LogMessage {
  message: string;
  timestamp: number;
}
