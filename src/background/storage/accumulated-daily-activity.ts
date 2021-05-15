export type DaylyWebsiteActivity = Record<string, number>;

// TODO: Take in account background time
// Splt metrics to total active and total bckground time

export class AccumulatedDailyActivityStorage {
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
