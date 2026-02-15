export const VALIDATION_CONSTANTS = {
  MIN_DURATION_MINUTES: 15,
  MAX_DURATION_MINUTES: 480,
  MIN_NAME_LENGTH: 2,
} as const;

export const ERROR_MESSAGES = {
  NAME_TOO_SHORT: "Name must be at least 2 characters long",
  INVALID_EMAIL: "Please enter a valid email address",
  INVALID_DATE: "Please enter a valid date",
  INVALID_TIME: "Please enter a valid time",
  INVALID_DURATION: "Duration must be between 15 and 480 minutes",
  PAST_DATE_TIME: "Cannot book appointments in the past.",
  TIME_SLOT_BOOKED: "This time slot is already booked. Please choose another time.",
  DELETE_CONFIRMATION: "Are you sure you want to delete this booking?",
  SYNC_FAILED: "Failed to sync with backend. Your changes are saved locally.",
  SYNC_SUCCESS: "Successfully synced with backend.",
  BOOKING_CREATED: "Booking created successfully!",
  BOOKING_UPDATED: "Booking updated successfully!",
  BOOKING_DELETED: "Booking deleted successfully!",
  BOOKING_DELETE_FAILED: "Failed to delete booking. Please try again.",
  NETWORK_ERROR: "Network error. Please check your connection.",
  UNKNOWN_ERROR: "An unexpected error occurred. Please try again.",
} as const;
