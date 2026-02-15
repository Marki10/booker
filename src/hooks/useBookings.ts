import { useState, useEffect, useCallback } from "react";
import type { Booking, BookingFormData } from "../types/interfaces";
import { bookingService } from "../services/bookingService";

export const useBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<{
    lastSync: string | null;
    pendingSync: boolean;
    backendAvailable: boolean;
  }>({
    lastSync: null,
    pendingSync: false,
    backendAvailable: false,
  });

  const updateSyncStatus = useCallback(() => {
    const status = bookingService.getSyncStatus();
    setSyncStatus(status);
  }, []);

  const loadBookings = useCallback(() => {
    const allBookings = bookingService.getAllBookings();
    setBookings(allBookings);
    updateSyncStatus();
  }, [updateSyncStatus]);

  const syncWithBackend = useCallback(
    async (): Promise<{ success: boolean; error?: string }> => {
    setIsSyncing(true);
    try {
      const result = await bookingService.syncWithBackend();
      if (result.success) {
        loadBookings();
      }
      updateSyncStatus();
      return result;
    } catch (error) {
      console.error("Sync error:", error);
      updateSyncStatus();
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown sync error",
      };
    } finally {
      setIsSyncing(false);
    }
    },
    [loadBookings, updateSyncStatus],
  );

  const createBooking = useCallback(
    async (formData: BookingFormData) => {
      await bookingService.createBooking(formData);
      loadBookings();
    },
    [loadBookings],
  );

  const updateBooking = useCallback(
    async (id: string, formData: BookingFormData) => {
      await bookingService.updateBooking(id, formData);
      loadBookings();
    },
    [loadBookings],
  );

  const deleteBooking = useCallback(
    async (id: string) => {
      await bookingService.deleteBooking(id);
      loadBookings();
    },
    [loadBookings],
  );

  useEffect(() => {
    // Load from localStorage first (instant)
    loadBookings();

    // Then try to sync with backend
    syncWithBackend();
  }, [loadBookings, syncWithBackend]);

  return {
    bookings,
    isSyncing,
    syncStatus,
    syncWithBackend,
    createBooking,
    updateBooking,
    deleteBooking,
    loadBookings,
  };
};
