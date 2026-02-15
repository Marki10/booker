import { describe, it, expect } from "vitest";
import {
  validateEmail,
  validateName,
  validateTime,
  validateDate,
  validateBookingForm,
} from "../validation";

describe("validation", () => {
  describe("validateEmail", () => {
    it("should return true for valid email addresses", () => {
      expect(validateEmail("test@example.com")).toBe(true);
      expect(validateEmail("user.name@domain.co.uk")).toBe(true);
      expect(validateEmail("user+tag@example.org")).toBe(true);
    });

    it("should return false for invalid email addresses", () => {
      expect(validateEmail("invalid")).toBe(false);
      expect(validateEmail("invalid@")).toBe(false);
      expect(validateEmail("@example.com")).toBe(false);
      expect(validateEmail("test@")).toBe(false);
      expect(validateEmail("")).toBe(false);
    });
  });

  describe("validateName", () => {
    it("should return true for names with at least 2 characters", () => {
      expect(validateName("John")).toBe(true);
      expect(validateName("AB")).toBe(true);
      expect(validateName("Mary Jane")).toBe(true);
    });

    it("should return false for names shorter than 2 characters", () => {
      expect(validateName("A")).toBe(false);
      expect(validateName("")).toBe(false);
      expect(validateName(" ")).toBe(false);
    });

    it("should trim whitespace before validation", () => {
      expect(validateName("  AB  ")).toBe(true);
      expect(validateName("  A  ")).toBe(false);
    });
  });

  describe("validateTime", () => {
    it("should return true for valid time formats", () => {
      expect(validateTime("09:00")).toBe(true);
      expect(validateTime("14:30")).toBe(true);
      expect(validateTime("23:59")).toBe(true);
      expect(validateTime("00:00")).toBe(true);
    });

    it("should return false for invalid time formats", () => {
      expect(validateTime("25:00")).toBe(false);
      expect(validateTime("12:60")).toBe(false);
      expect(validateTime("9:00")).toBe(false);
      expect(validateTime("09:0")).toBe(false);
      expect(validateTime("invalid")).toBe(false);
    });
  });

  describe("validateDate", () => {
    it("should return true for valid date strings", () => {
      expect(validateDate("2025-11-10")).toBe(true);
      expect(validateDate("2025-01-01")).toBe(true);
      expect(validateDate("2025-12-31")).toBe(true);
    });

    it("should return false for invalid date formats", () => {
      expect(validateDate("11-10-2025")).toBe(false);
      expect(validateDate("2025/11/10")).toBe(false);
      expect(validateDate("invalid")).toBe(false);
      expect(validateDate("2025-13-01")).toBe(false);
      expect(validateDate("2025-02-30")).toBe(false);
    });
  });

  describe("validateBookingForm", () => {
    it("should return empty array for valid form data", () => {
      const errors = validateBookingForm(
        "John Doe",
        "john@example.com",
        "2025-11-10",
        "14:30",
        60,
      );
      expect(errors).toEqual([]);
    });

    it("should return errors for invalid name", () => {
      const errors = validateBookingForm(
        "A",
        "john@example.com",
        "2025-11-10",
        "14:30",
        60,
      );
      expect(errors).toHaveLength(1);
      expect(errors[0].field).toBe("name");
    });

    it("should return errors for invalid email", () => {
      const errors = validateBookingForm(
        "John Doe",
        "invalid-email",
        "2025-11-10",
        "14:30",
        60,
      );
      expect(errors).toHaveLength(1);
      expect(errors[0].field).toBe("email");
    });

    it("should return errors for invalid date", () => {
      const errors = validateBookingForm(
        "John Doe",
        "john@example.com",
        "invalid-date",
        "14:30",
        60,
      );
      expect(errors).toHaveLength(1);
      expect(errors[0].field).toBe("date");
    });

    it("should return errors for invalid time", () => {
      const errors = validateBookingForm(
        "John Doe",
        "john@example.com",
        "2025-11-10",
        "25:00",
        60,
      );
      expect(errors).toHaveLength(1);
      expect(errors[0].field).toBe("time");
    });

    it("should return errors for invalid duration", () => {
      const errors = validateBookingForm(
        "John Doe",
        "john@example.com",
        "2025-11-10",
        "14:30",
        10,
      );
      expect(errors).toHaveLength(1);
      expect(errors[0].field).toBe("duration");
    });

    it("should return multiple errors for multiple invalid fields", () => {
      const errors = validateBookingForm("A", "invalid", "bad-date", "25:00", 10);
      expect(errors.length).toBeGreaterThan(1);
    });

    it("should validate duration boundaries", () => {
      expect(
        validateBookingForm("John", "john@example.com", "2025-11-10", "14:30", 14),
      ).toHaveLength(1);
      expect(
        validateBookingForm("John", "john@example.com", "2025-11-10", "14:30", 481),
      ).toHaveLength(1);
      expect(
        validateBookingForm("John", "john@example.com", "2025-11-10", "14:30", 15),
      ).toHaveLength(0);
      expect(
        validateBookingForm("John", "john@example.com", "2025-11-10", "14:30", 480),
      ).toHaveLength(0);
    });
  });
});
