export type WebsiteActivityPeriod = {
  hostname: string;
  // Date when the tab became active
  date: number;
};

export class HistoryActivityStorage {
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

  resetLastActivePage() {
    this.lastActivePage = null;
  }
}
