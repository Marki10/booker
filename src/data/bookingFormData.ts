import { getTimeSlots } from "../utils/dateUtils";

export const BOOKING_START_HOUR = 9;
export const BOOKING_END_HOUR = 17;
export const BOOKING_TIME_INTERVAL = 30;

export const timeSlots = getTimeSlots(
  BOOKING_START_HOUR,
  BOOKING_END_HOUR,
  BOOKING_TIME_INTERVAL,
);

export const durationOptions = [15, 30, 60, 90, 120, 180, 240] as const;
