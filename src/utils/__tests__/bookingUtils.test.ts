import { describe, it, expect } from "vitest";
import { bookingToFormData } from "../bookingUtils";
import type { Booking } from "../../types/interfaces";

describe("bookingUtils", () => {
  describe("bookingToFormData", () => {
    it("should convert Booking to BookingFormData", () => {
      const booking: Booking = {
        id: "booking-1",
        name: "John Doe",
        email: "john@example.com",
        date: "2025-11-10",
        time: "14:30",
        duration: 60,
        notes: "Test notes",
        status: "confirmed",
        createdAt: "2025-11-01T10:00:00Z",
        updatedAt: "2025-11-01T10:00:00Z",
      };

      const formData = bookingToFormData(booking);

      expect(formData).toEqual({
        name: "John Doe",
        email: "john@example.com",
        date: "2025-11-10",
        time: "14:30",
        duration: 60,
        notes: "Test notes",
      });
    });

    it("should handle booking without notes", () => {
      const booking: Booking = {
        id: "booking-2",
        name: "Jane Smith",
        email: "jane@example.com",
        date: "2025-11-11",
        time: "09:00",
        duration: 30,
        status: "pending",
        createdAt: "2025-11-01T10:00:00Z",
        updatedAt: "2025-11-01T10:00:00Z",
      };

      const formData = bookingToFormData(booking);

      expect(formData).toEqual({
        name: "Jane Smith",
        email: "jane@example.com",
        date: "2025-11-11",
        time: "09:00",
        duration: 30,
        notes: undefined,
      });
    });

    it("should not include booking metadata fields", () => {
      const booking: Booking = {
        id: "booking-3",
        name: "Test User",
        email: "test@example.com",
        date: "2025-11-12",
        time: "15:00",
        duration: 90,
        status: "confirmed",
        createdAt: "2025-11-01T10:00:00Z",
        updatedAt: "2025-11-01T10:00:00Z",
      };

      const formData = bookingToFormData(booking);

      expect(formData).not.toHaveProperty("id");
      expect(formData).not.toHaveProperty("status");
      expect(formData).not.toHaveProperty("createdAt");
      expect(formData).not.toHaveProperty("updatedAt");
    });
  });
});
