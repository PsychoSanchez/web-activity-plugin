import { WindowActiveTabStateMonitor } from './background/tracking/active-tabs.monitor';
import { ActiveTabTracker } from './background/tracking/active-tab.tracker';
import {
  addGetActivityStoreMessageListener as addRuntimeStoreMessageListener,
  sendMessageWithStoreUpdate,
} from './shared/background-browser-sync-storage';
import { createGlobalSyncStorageListener } from './shared/browser-sync-storage';

try {
  const storage = createGlobalSyncStorageListener();
  const activeTabTracker = new ActiveTabTracker(storage);
  const activeTabMonitor = new WindowActiveTabStateMonitor();

  activeTabMonitor.init().then(() => {
    activeTabMonitor.onStateChange((newState) =>
      activeTabTracker.trackNewActiveTabState(newState)
    );
  });

  addRuntimeStoreMessageListener(storage);
  storage.onChanged(sendMessageWithStoreUpdate);
} catch (error) {
  console.error(error);
}
