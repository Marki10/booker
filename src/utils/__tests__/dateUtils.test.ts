import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  formatDate,
  formatTime,
  formatDateTime,
  getTodayDate,
  getTimeSlots,
  isPastDate,
  isPastDateTime,
} from "../dateUtils";

describe("dateUtils", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("formatDate", () => {
    it("should format date string to readable format", () => {
      const result = formatDate("2025-11-10");
      expect(result).toContain("November");
      expect(result).toContain("10");
      expect(result).toContain("2025");
    });

    it("should handle different dates correctly", () => {
      const result = formatDate("2025-01-01");
      expect(result).toContain("January");
      expect(result).toContain("1");
    });
  });

  describe("formatTime", () => {
    it("should format 24-hour time to 12-hour with AM/PM", () => {
      expect(formatTime("09:00")).toBe("9:00 AM");
      expect(formatTime("14:30")).toBe("2:30 PM");
      expect(formatTime("12:00")).toBe("12:00 PM");
      expect(formatTime("00:00")).toBe("12:00 AM");
      expect(formatTime("23:59")).toBe("11:59 PM");
    });
  });

  describe("formatDateTime", () => {
    it("should combine date and time formatting", () => {
      const result = formatDateTime("2025-11-10", "14:30");
      expect(result).toContain("November");
      expect(result).toContain("2:30 PM");
      expect(result).toContain("at");
    });
  });

  describe("getTodayDate", () => {
    it("should return today's date in YYYY-MM-DD format", () => {
      vi.setSystemTime(new Date("2025-11-10T12:00:00Z"));
      const result = getTodayDate();
      expect(result).toBe("2025-11-10");
    });

    it("should return correct format", () => {
      vi.setSystemTime(new Date("2025-01-01T00:00:00Z"));
      const result = getTodayDate();
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe("getTimeSlots", () => {
    it("should generate time slots with default parameters", () => {
      const slots = getTimeSlots();
      expect(slots.length).toBeGreaterThan(0);
      expect(slots[0]).toBe("09:00");
      expect(slots).toContain("16:30");
    });

    it("should generate slots with custom parameters", () => {
      const slots = getTimeSlots(10, 12, 30);
      expect(slots).toEqual(["10:00", "10:30", "11:00", "11:30"]);
    });

    it("should handle 15-minute intervals", () => {
      const slots = getTimeSlots(9, 10, 15);
      expect(slots).toEqual(["09:00", "09:15", "09:30", "09:45"]);
    });
  });

  describe("isPastDate", () => {
    it("should return true for past dates", () => {
      vi.setSystemTime(new Date("2025-11-10T12:00:00Z"));
      expect(isPastDate("2025-11-09")).toBe(true);
      expect(isPastDate("2025-01-01")).toBe(true);
    });

    it("should return false for today and future dates", () => {
      vi.setSystemTime(new Date("2025-11-10T12:00:00Z"));
      expect(isPastDate("2025-11-10")).toBe(false);
      expect(isPastDate("2025-11-11")).toBe(false);
    });
  });

  describe("isPastDateTime", () => {
    it("should return true for past date and time", () => {
      vi.setSystemTime(new Date("2025-11-10T14:00:00Z"));
      expect(isPastDateTime("2025-11-10", "13:00")).toBe(true);
      expect(isPastDateTime("2025-11-09", "23:59")).toBe(true);
    });

    it("should return false for future date and time", () => {
      vi.setSystemTime(new Date("2025-11-10T14:00:00Z"));
      expect(isPastDateTime("2025-11-10", "15:00")).toBe(false);
      expect(isPastDateTime("2025-11-11", "09:00")).toBe(false);
    });

    it("should return false for current time", () => {
      vi.setSystemTime(new Date("2025-11-10T14:00:00Z"));
      expect(isPastDateTime("2025-11-10", "14:01")).toBe(false);
    });
  });
});
