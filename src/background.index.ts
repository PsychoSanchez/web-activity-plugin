import {
  ActiveTabTrackerListener,
  ActiveTabTracker,
} from './background/tracking/active-tab-tracker';

const tabTracker = new ActiveTabTracker();

type WebsiteActivityPeriod = {
  hostname: string;
  // Date when the tab became active
  date: number;
};

type DaylyWebsiteActivity = Record<string, number>;

class HistoryActivityStorage {
  private lastActivePage: WebsiteActivityPeriod | null = null;
  private activityHistory: WebsiteActivityPeriod[] = [];

  getLastActivePage() {
    return this.lastActivePage ? this.lastActivePage : null;
  }

  setLastActivePage(host: string, date: number) {
    this.lastActivePage = {
      hostname: host,
      date,
    };

    this.activityHistory.push(this.lastActivePage);
  }
}

class AccumulatedDailyActivityStorage {
  private storage: Record<string, DaylyWebsiteActivity> = {};

  addTime(host: string, duration: number) {
    const accTimeSpent = this.getTodayHostActivityTime(host) + duration;

    this.setTodaysHostActivityTime(host, accTimeSpent);
  }

  private getTodayHostActivityTime(host: string) {
    const storage = this.getTodayStorageRecord();

    return storage[host] || 0;
  }

  private setTodaysHostActivityTime(host: string, time: number) {
    const key = this.getTodayStorageKey();
    const record = this.storage[key] || {};

    record[host] = time;

    this.updateStorageRecord(key, record);
  }

  private updateStorageRecord(key: string, record: DaylyWebsiteActivity) {
    this.storage[key] = record;

    console.log(this.storage);
  }

  private getTodayStorageRecord() {
    const key = this.getTodayStorageKey();

    return this.storage[key] || {};
  }

  private getTodayStorageKey() {
    const today = new Date();
    const key =
      today.getFullYear().toString() +
      today.getMonth().toString().padStart(2, '0') +
      today.getDate().toString().padStart(2, '0');
    return key;
  }
}

const history = new HistoryActivityStorage();
const accumulated = new AccumulatedDailyActivityStorage();

const handleActiveTabChange: ActiveTabTrackerListener = (newTab, prevTab) => {
  const url = newTab?.url;

  if (!url) {
    return;
  }

  const newTabUrl = new URL(url);

  const ts = Date.now();
  const prevActivePage = history.getLastActivePage();

  history.setLastActivePage(newTabUrl.hostname, ts);

  if (prevActivePage) {
    accumulated.addTime(prevActivePage.hostname, ts - prevActivePage.date);
  }
};

try {
  tabTracker.addListener(handleActiveTabChange);
} catch (error) {
  console.error(error);
}
