import type { Booking, BookingFormData } from "../types/booking";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const API_TIMEOUT = 5000; // 5 seconds

interface ApiError {
  error: string;
  details?: unknown;
}

// Check if backend is available
export const checkBackendAvailable = async (): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

    const response = await fetch(`${API_URL.replace("/api", "")}/health`, {
      method: "GET",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
      },
    });

    clearTimeout(timeoutId);
    return response.ok;
  } catch {
    return false;
  }
};

// API service for backend communication
export const apiService = {
  // Get all bookings from backend
  async getAllBookings(): Promise<Booking[]> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

      const response = await fetch(`${API_URL}/bookings`, {
        method: "GET",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Failed to fetch bookings: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error("Request timeout: Backend is not responding");
      }
      throw error;
    }
  },

  // Get booking by ID
  async getBookingById(id: string): Promise<Booking> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

      const response = await fetch(`${API_URL}/bookings/${id}`, {
        method: "GET",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Failed to fetch booking: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error("Request timeout: Backend is not responding");
      }
      throw error;
    }
  },

  // Create booking on backend
  async createBooking(data: BookingFormData): Promise<Booking> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

      const response = await fetch(`${API_URL}/bookings`, {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error: ApiError = await response.json().catch(() => ({
          error: response.statusText,
        }));
        throw new Error(error.error || "Failed to create booking");
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error("Request timeout: Backend is not responding");
      }
      throw error;
    }
  },

  // Update booking on backend
  async updateBooking(
    id: string,
    data: Partial<BookingFormData>,
  ): Promise<Booking> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

      const response = await fetch(`${API_URL}/bookings/${id}`, {
        method: "PUT",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error: ApiError = await response.json().catch(() => ({
          error: response.statusText,
        }));
        throw new Error(error.error || "Failed to update booking");
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error("Request timeout: Backend is not responding");
      }
      throw error;
    }
  },

  // Delete booking on backend
  async deleteBooking(id: string): Promise<void> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

      const response = await fetch(`${API_URL}/bookings/${id}`, {
        method: "DELETE",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Failed to delete booking: ${response.statusText}`);
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error("Request timeout: Backend is not responding");
      }
      throw error;
    }
  },

  // Check availability on backend
  async checkAvailability(
    date: string,
    time: string,
    duration: number,
    excludeBookingId?: string,
  ): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

      const response = await fetch(`${API_URL}/bookings/availability`, {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date,
          time,
          duration,
          excludeBookingId,
        }),
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Failed to check availability: ${response.statusText}`);
      }

      const data = await response.json();
      return data.available;
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error("Request timeout: Backend is not responding");
      }
      throw error;
    }
  },
};
