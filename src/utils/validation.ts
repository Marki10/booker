import type { ValidationError } from "../types/interfaces";
import { VALIDATION_CONSTANTS, ERROR_MESSAGES } from "../constants/validation";

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateName = (name: string): boolean => {
  return name.trim().length >= VALIDATION_CONSTANTS.MIN_NAME_LENGTH;
};

export const validateTime = (time: string): boolean => {
  const timeRegex = /^([01][0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
};

export const validateDate = (date: string): boolean => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) return false;

  const d = new Date(date);
  if (!(d instanceof Date) || isNaN(d.getTime())) {
    return false;
  }

  const [year, month, day] = date.split("-").map(Number);
  return (
    d.getFullYear() === year &&
    d.getMonth() + 1 === month &&
    d.getDate() === day
  );
};

export const validateBookingForm = (
  name: string,
  email: string,
  date: string,
  time: string,
  duration: number,
): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!validateName(name)) {
    errors.push({
      field: "name",
      message: ERROR_MESSAGES.NAME_TOO_SHORT,
    });
  }

  if (!validateEmail(email)) {
    errors.push({
      field: "email",
      message: ERROR_MESSAGES.INVALID_EMAIL,
    });
  }

  if (!validateDate(date)) {
    errors.push({ field: "date", message: ERROR_MESSAGES.INVALID_DATE });
  }

  if (!validateTime(time)) {
    errors.push({ field: "time", message: ERROR_MESSAGES.INVALID_TIME });
  }

  if (
    duration < VALIDATION_CONSTANTS.MIN_DURATION_MINUTES ||
    duration > VALIDATION_CONSTANTS.MAX_DURATION_MINUTES
  ) {
    errors.push({
      field: "duration",
      message: ERROR_MESSAGES.INVALID_DURATION,
    });
  }

  return errors;
};
