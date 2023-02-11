import { IdleState, Tab } from '../browser-api.types';

export type TimeStore = Record<string, Record<string, number>>;

export interface TimelineRecord {
  tabId: number;
  url: string;
  hostname: string;
  docTitle: string;
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

export interface Preferences {
  ignoredHosts: string[];
  limits: Record<string, number>;
  displayTimeOnBadge: boolean;
}

export interface DomainInfo {
  hostname: string;
  iconUrl: string;
}
