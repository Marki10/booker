import axios, { AxiosInstance } from "axios";
import type {
  Booking,
  BookingFormData,
  ApiError,
} from "../types/interfaces";

const API_URL =
  (typeof process !== "undefined" &&
    process.env.NEXT_PUBLIC_API_URL) ||
  "http://localhost:3000/api";
const API_TIMEOUT = 5000; // 5 seconds

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

const handleAxiosError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
      throw new Error("Request timeout: Backend is not responding");
    }
    if (error.response) {
      const apiError: ApiError = error.response.data || {
        error: error.response.statusText || "Request failed",
      };
      throw new Error(apiError.error || `Request failed: ${error.response.statusText}`);
    }
    if (error.request) {
      throw new Error("No response from server. Please check your connection.");
    }
  }
  throw error instanceof Error ? error : new Error("An unknown error occurred");
};

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

export const apiService = {
  async getAllBookings(): Promise<Booking[]> {
    try {
      const response = await axiosInstance.get<Booking[]>("/bookings");
      return response.data;
    } catch (error) {
      return handleAxiosError(error);
    }
  },

  async getBookingById(id: string): Promise<Booking> {
    try {
      const response = await axiosInstance.get<Booking>(`/bookings/${id}`);
      return response.data;
    } catch (error) {
      return handleAxiosError(error);
    }
  },

  async createBooking(data: BookingFormData): Promise<Booking> {
    try {
      const response = await axiosInstance.post<Booking>("/bookings", data);
      return response.data;
    } catch (error) {
      return handleAxiosError(error);
    }
  },

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

  async deleteBooking(id: string): Promise<void> {
    try {
      await axiosInstance.delete(`/bookings/${id}`);
    } catch (error) {
      handleAxiosError(error);
    }
  },

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
