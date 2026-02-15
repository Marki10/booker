import type { Booking, BookingFormData } from "../types/interfaces";
import { storageService } from "./storageService";
import { apiService, checkBackendAvailable } from "./apiService";

let nextId = 1;
let isBackendAvailable = false;
let syncInProgress = false;

// Initialize: Load from localStorage and get nextId
const initializeStorage = (): void => {
  const bookings = storageService.getBookings();
  if (bookings.length > 0) {
    // Find the highest ID number
    const ids = bookings
      .map((b) => {
        const match = b.id.match(/booking-(\d+)/);
        return match ? parseInt(match[1], 10) : 0;
      })
      .filter((id) => id > 0);
    nextId = ids.length > 0 ? Math.max(...ids) + 1 : 1;
  }
};

// Initialize on module load
initializeStorage();

// Merge local and remote bookings (remote takes precedence for conflicts)
const mergeBookings = (local: Booking[], remote: Booking[]): Booking[] => {
  const merged = new Map<string, Booking>();

  // Add local bookings
  local.forEach((booking) => {
    merged.set(booking.id, booking);
  });

  // Overwrite with remote bookings (remote is source of truth)
  remote.forEach((booking) => {
    merged.set(booking.id, booking);
  });

  return Array.from(merged.values());
};

export const bookingService = {
  // Check backend availability
  async checkBackend(): Promise<boolean> {
    isBackendAvailable = await checkBackendAvailable();
    return isBackendAvailable;
  },

  // Sync with backend
  async syncWithBackend(): Promise<{ success: boolean; error?: string }> {
    if (syncInProgress) {
      return { success: false, error: "Sync already in progress" };
    }

    syncInProgress = true;

    try {
      // Check if backend is available
      const backendAvailable = await this.checkBackend();
      if (!backendAvailable) {
        syncInProgress = false;
        return { success: false, error: "Backend is not available" };
      }

      // Get local bookings
      const localBookings = storageService.getBookings();

      // Get remote bookings
      const remoteBookings = await apiService.getAllBookings();

      // Merge bookings (remote takes precedence)
      const mergedBookings = mergeBookings(localBookings, remoteBookings);

      // Save merged bookings to localStorage
      storageService.saveBookings(mergedBookings);

      // Update sync metadata
      storageService.saveSyncMetadata({
        lastSync: new Date().toISOString(),
        lastSyncId: remoteBookings.length > 0 ? remoteBookings[0].id : null,
        pendingSync: false,
      });

      // Update nextId based on merged bookings
      const ids = mergedBookings
        .map((b) => {
          const match = b.id.match(/booking-(\d+)/);
          return match ? parseInt(match[1], 10) : 0;
        })
        .filter((id) => id > 0);
      nextId = ids.length > 0 ? Math.max(...ids) + 1 : 1;

      syncInProgress = false;
      return { success: true };
    } catch (error) {
      syncInProgress = false;
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error during sync";
      console.error("Sync error:", errorMessage);
      return { success: false, error: errorMessage };
    }
  },

  // Get all bookings (from localStorage)
  getAllBookings(): Booking[] {
    const bookings = storageService.getBookings();
    return [...bookings].sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return dateA.getTime() - dateB.getTime();
    });
  },

  // Get booking by ID
  getBookingById(id: string): Booking | undefined {
    const bookings = storageService.getBookings();
    return bookings.find((booking) => booking.id === id);
  },

  // Create a new booking
  async createBooking(data: BookingFormData): Promise<Booking> {
    const now = new Date().toISOString();
    const newBooking: Booking = {
      id: `booking-${nextId++}`,
      ...data,
      status: "confirmed",
      createdAt: now,
      updatedAt: now,
    };

    // Save to localStorage immediately
    const bookings = storageService.getBookings();
    bookings.push(newBooking);
    storageService.saveBookings(bookings);

    // Try to sync with backend (fire and forget)
    if (isBackendAvailable) {
      this.syncWithBackend().catch((error) => {
        console.error("Failed to sync after create:", error);
        // Mark as pending sync
        const metadata = storageService.getSyncMetadata();
        storageService.saveSyncMetadata({
          ...metadata,
          pendingSync: true,
        });
      });

      // Also try to create directly on backend
      try {
        const backendBooking = await apiService.createBooking(data);
        // Update local booking with backend ID and data
        const updatedBookings = bookings.map((b) =>
          b.id === newBooking.id ? backendBooking : b,
        );
        storageService.saveBookings(updatedBookings);
        return backendBooking;
      } catch (error) {
        console.error(
          "Failed to create on backend, using local booking:",
          error,
        );
        // Continue with local booking
      }
    }

    return newBooking;
  },

  // Update a booking
  async updateBooking(
    id: string,
    data: Partial<BookingFormData>,
  ): Promise<Booking | null> {
    const bookings = storageService.getBookings();
    const index = bookings.findIndex((booking) => booking.id === id);
    if (index === -1) return null;

    const updatedBooking: Booking = {
      ...bookings[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    bookings[index] = updatedBooking;
    storageService.saveBookings(bookings);

    // Try to sync with backend (fire and forget)
    if (isBackendAvailable) {
      this.syncWithBackend().catch((error) => {
        console.error("Failed to sync after update:", error);
        const metadata = storageService.getSyncMetadata();
        storageService.saveSyncMetadata({
          ...metadata,
          pendingSync: true,
        });
      });

      // Also try to update directly on backend
      try {
        const backendBooking = await apiService.updateBooking(id, data);
        // Update local booking with backend data
        const updatedBookings = bookings.map((b) =>
          b.id === id ? backendBooking : b,
        );
        storageService.saveBookings(updatedBookings);
        return backendBooking;
      } catch (error) {
        console.error(
          "Failed to update on backend, using local booking:",
          error,
        );
        // Continue with local booking
      }
    }

    return updatedBooking;
  },

  // Delete a booking
  async deleteBooking(id: string): Promise<boolean> {
    const bookings = storageService.getBookings();
    const index = bookings.findIndex((booking) => booking.id === id);
    if (index === -1) return false;

    bookings.splice(index, 1);
    storageService.saveBookings(bookings);

    // Try to sync with backend (fire and forget)
    if (isBackendAvailable) {
      this.syncWithBackend().catch((error) => {
        console.error("Failed to sync after delete:", error);
        const metadata = storageService.getSyncMetadata();
        storageService.saveSyncMetadata({
          ...metadata,
          pendingSync: true,
        });
      });

      // Also try to delete directly on backend
      try {
        await apiService.deleteBooking(id);
      } catch (error) {
        console.error(
          "Failed to delete on backend, using local deletion:",
          error,
        );
        // Continue with local deletion
      }
    }

    return true;
  },

  // Get bookings for a specific date
  getBookingsByDate(date: string): Booking[] {
    const bookings = storageService.getBookings();
    return bookings.filter((booking) => booking.date === date);
  },

  // Check if a time slot is available
  async isTimeSlotAvailable(
    date: string,
    time: string,
    duration: number,
    excludeBookingId?: string,
  ): Promise<boolean> {
    // First check locally
    const bookings = storageService.getBookings();
    const requestedStart = new Date(`${date}T${time}`);
    const requestedEnd = new Date(requestedStart.getTime() + duration * 60000);

    const localConflict = bookings.some((booking) => {
      if (excludeBookingId && booking.id === excludeBookingId) return false;

      const bookingStart = new Date(`${booking.date}T${booking.time}`);
      const bookingEnd = new Date(
        bookingStart.getTime() + booking.duration * 60000,
      );

      return (
        (requestedStart >= bookingStart && requestedStart < bookingEnd) ||
        (requestedEnd > bookingStart && requestedEnd <= bookingEnd) ||
        (requestedStart <= bookingStart && requestedEnd >= bookingEnd)
      );
    });

    if (localConflict) return false;

    // If backend is available, also check remotely
    if (isBackendAvailable) {
      try {
        return await apiService.checkAvailability(
          date,
          time,
          duration,
          excludeBookingId,
        );
      } catch (error) {
        console.error(
          "Failed to check availability on backend, using local check:",
          error,
        );
        // Continue with local check result
      }
    }

    return true;
  },

  // Get sync status
  getSyncStatus(): {
    lastSync: string | null;
    pendingSync: boolean;
    backendAvailable: boolean;
  } {
    const metadata = storageService.getSyncMetadata();
    return {
      lastSync: metadata.lastSync,
      pendingSync: metadata.pendingSync,
      backendAvailable: isBackendAvailable,
    };
  },
};

// Initialize backend check on module load
bookingService.checkBackend().catch(() => {
  // Backend not available, continue with localStorage only
});
