import { TimelineRecord } from '@shared/db/types';
import { getMinutesInMs } from '@shared/utils/dates-helper';

const presentHour = (hour: number) => `${hour.toString().padStart(2, '0')}:00`;
export const MINIMUM_DISPLAYED_ACTIVITY = getMinutesInMs(1);

export function getChartTimeLabels(
  timelineStartHour: number,
  timelineEndHour: number,
) {
  return new Array(timelineEndHour - timelineStartHour + 1)
    .fill(0)
    .map((_, i) => {
      const hour = (timelineStartHour + i) % 24;

      return `${presentHour(hour)}-${presentHour((hour + 1) % 24)}`;
    });
}

const createNewTimelineDataset = () => new Array(24).fill([0, 0]);

export const transformTimelineDataset = (activityEvents: TimelineRecord[]) => {
  const chartDatasetData: [number, number][][] = [];
  let timelineStartHour = 24;
  let timelineEndHour = 0;

  const updateTimelineStartAndEndHour = (hour: number) => {
    timelineStartHour = Math.min(hour, timelineStartHour);
    timelineEndHour = Math.max(hour, timelineEndHour);
  };

  const pushTimelineDataToDataset = (
    hour: number,
    duration: [number, number],
  ) => {
    updateTimelineStartAndEndHour(hour);

    const emptyDataset = chartDatasetData.find((dataset) => {
      const ds = dataset[hour];
      if (ds) {
        return ds[0] === 0 && ds[1] === 0;
      }

      return false;
    });

    if (emptyDataset) {
      emptyDataset[hour] = duration;
      return;
    }

    const newDataSet = createNewTimelineDataset();
    newDataSet[hour] = duration;

    chartDatasetData.push(newDataSet);
  };

  activityEvents.forEach((event) => {
    const eventStartDate = new Date(event.activityPeriodStart);
    const eventEndDate = new Date(event.activityPeriodEnd);
    const eventEndHour = eventEndDate.getHours();
    const eventStartHour = eventStartDate.getHours();

    const isInTheSameHour = eventEndHour === eventStartHour;

    if (isInTheSameHour) {
      pushTimelineDataToDataset(eventStartHour, [
        eventStartDate.getMinutes(),
        eventEndDate.getMinutes(),
      ]);
      return;
    }

    // Split event into two
    pushTimelineDataToDataset(eventStartHour, [
      eventStartDate.getMinutes(),
      59,
    ]);
    pushTimelineDataToDataset(eventEndHour, [0, eventEndDate.getMinutes()]);
  });

  return {
    chartDatasetData,
    timelineStartHour: Math.min(timelineStartHour, timelineEndHour),
    timelineEndHour: Math.max(timelineStartHour, timelineEndHour),
  };
};

export const joinNeighborTimelineEvents = (
  activityEvents: TimelineRecord[],
) => {
  return activityEvents.reduce(
    (acc, record, index) => {
      if (!index) {
        acc.push(record);
        return acc;
      }

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- we know that the previous record exists
      const previousNeighbor = acc[acc.length - 1]!;

      const timeBetweenEvents =
        record.activityPeriodStart - previousNeighbor.activityPeriodEnd;

      const isLessThenMinimumBetweenEvents =
        timeBetweenEvents < MINIMUM_DISPLAYED_ACTIVITY;

      if (isLessThenMinimumBetweenEvents) {
        previousNeighbor.activityPeriodEnd = record.activityPeriodEnd;

        return acc;
      }

      acc.push(record);

      return acc;
    },
    [] as typeof activityEvents,
  );
};
