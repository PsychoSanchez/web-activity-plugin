import { addActivityTimeToHost } from './background/storage/accumulated-daily-activity';
import {
  ActiveTabState,
  WindowActiveTabStateMonitor,
} from './background/tracking/active-tab-tracker';
import {
  addGetActivityStoreMessageListener,
  sendMessageWithStoreUpdate,
} from './shared/background-browser-sync-storage';
import { createGlobalSyncStorageListener } from './shared/browser-sync-storage';

try {
  const browserSyncStorage = createGlobalSyncStorageListener();
  // const activeTabTracker = new ActiveTabTracker();
  // const history = new HistoryActivityStorage();

  let previousStateChange: {
    state: ActiveTabState | null;
    date: number;
  } = {
    state: null,
    date: Date.now(),
  };

  const tryAddTimeToHostname = (url: string | undefined, date: number) => {
    if (!url) {
      return;
    }

    const { hostname } = new URL(url);
    console.log(hostname, date - previousStateChange.date);

    addActivityTimeToHost(
      browserSyncStorage,
      hostname,
      date - previousStateChange.date
    );
  };

  const isActiveOrIdleAndTabAudible = (state: ActiveTabState) =>
    state.idleState === 'active' ||
    (state.idleState === 'idle' && state.lastActiveTab?.audible);

  const activeTabMonitor = new WindowActiveTabStateMonitor();
  activeTabMonitor.init().then(() => {
    activeTabMonitor.onStateChange((newState) => {
      console.log(previousStateChange.state, newState);
      const date = Date.now();

      if (previousStateChange.state === null) {
        previousStateChange = { state: newState, date };
        return;
      }

      if (
        newState.idleState === 'locked' ||
        (newState.idleState === 'idle' &&
          newState.lastActiveTab &&
          !newState.lastActiveTab.audible)
      ) {
        if (isActiveOrIdleAndTabAudible(previousStateChange.state)) {
          tryAddTimeToHostname(
            previousStateChange.state?.lastActiveTab?.url,
            date
          );
        }

        previousStateChange = { state: null, date };

        return;
      }
      if (isActiveOrIdleAndTabAudible(previousStateChange.state)) {
        tryAddTimeToHostname(
          previousStateChange.state?.lastActiveTab?.url,
          date
        );
      }

      previousStateChange = { state: newState, date };
    });
  });

  addGetActivityStoreMessageListener(browserSyncStorage);
  browserSyncStorage.subscribe(sendMessageWithStoreUpdate);
} catch (error) {
  console.error(error);
}
