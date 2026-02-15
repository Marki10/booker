import axios, { AxiosInstance } from "axios";
import type {
  Booking,
  BookingFormData,
  ApiError,
} from "../types/interfaces";

// Next.js makes NEXT_PUBLIC_* env vars available at build time
const API_URL =
  (typeof process !== "undefined" &&
    process.env.NEXT_PUBLIC_API_URL) ||
  "http://localhost:3000/api";
const API_TIMEOUT = 5000; // 5 seconds

// Create axios instance with default config
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper function to handle axios errors
const handleAxiosError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
      throw new Error("Request timeout: Backend is not responding");
    }
    if (error.response) {
      // Server responded with error status
      const apiError: ApiError = error.response.data || {
        error: error.response.statusText || "Request failed",
      };
      throw new Error(apiError.error || `Request failed: ${error.response.statusText}`);
    }
    if (error.request) {
      // Request was made but no response received
      throw new Error("No response from server. Please check your connection.");
    }
  }
  // Unknown error
  throw error instanceof Error ? error : new Error("An unknown error occurred");
};

// Check if backend is available
export const checkBackendAvailable = async (): Promise<boolean> => {
  try {
    const healthUrl = API_URL.replace("/api", "") + "/health";
    await axiosInstance.get(healthUrl, {
      timeout: API_TIMEOUT,
    });
    return true;
  } catch {
    return false;
  }
};

// API service for backend communication
export const apiService = {
  // Get all bookings from backend
  async getAllBookings(): Promise<Booking[]> {
    try {
      const response = await axiosInstance.get<Booking[]>("/bookings");
      return response.data;
    } catch (error) {
      return handleAxiosError(error);
    }
  },

  // Get booking by ID
  async getBookingById(id: string): Promise<Booking> {
    try {
      const response = await axiosInstance.get<Booking>(`/bookings/${id}`);
      return response.data;
    } catch (error) {
      return handleAxiosError(error);
    }
  },

  // Create booking on backend
  async createBooking(data: BookingFormData): Promise<Booking> {
    try {
      const response = await axiosInstance.post<Booking>("/bookings", data);
      return response.data;
    } catch (error) {
      return handleAxiosError(error);
    }
  },

  // Update booking on backend
  async updateBooking(
    id: string,
    data: Partial<BookingFormData>,
  ): Promise<Booking> {
    try {
      const response = await axiosInstance.put<Booking>(`/bookings/${id}`, data);
      return response.data;
    } catch (error) {
      return handleAxiosError(error);
    }
  },

  // Delete booking on backend
  async deleteBooking(id: string): Promise<void> {
    try {
      await axiosInstance.delete(`/bookings/${id}`);
    } catch (error) {
      handleAxiosError(error);
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
      const response = await axiosInstance.post<{ available: boolean }>(
        "/bookings/availability",
        {
          date,
          time,
          duration,
          excludeBookingId,
        },
      );
      return response.data.available;
    } catch (error) {
      return handleAxiosError(error);
    }
  },
};
