import type { Booking, BookingFormData } from "../types/interfaces";
import { storageService } from "./storageService";
import { apiService, checkBackendAvailable } from "./apiService";

let nextId = 1;
let isBackendAvailable = false;
let syncInProgress = false;

const initializeStorage = (): void => {
  const bookings = storageService.getBookings();
  if (bookings.length > 0) {
    const ids = bookings
      .map((b) => {
        const match = b.id.match(/booking-(\d+)/);
        return match ? parseInt(match[1], 10) : 0;
      })
      .filter((id) => id > 0);
    nextId = ids.length > 0 ? Math.max(...ids) + 1 : 1;
  }
};

initializeStorage();

const mergeBookings = (local: Booking[], remote: Booking[]): Booking[] => {
  const merged = new Map<string, Booking>();

  local.forEach((booking) => {
    merged.set(booking.id, booking);
  });

  remote.forEach((booking) => {
    merged.set(booking.id, booking);
  });

  return Array.from(merged.values());
};

export const bookingService = {
  async checkBackend(): Promise<boolean> {
    isBackendAvailable = await checkBackendAvailable();
    return isBackendAvailable;
  },

  async syncWithBackend(): Promise<{ success: boolean; error?: string }> {
    if (syncInProgress) {
      return { success: false, error: "Sync already in progress" };
    }

    syncInProgress = true;

    try {
      const backendAvailable = await this.checkBackend();
      if (!backendAvailable) {
        syncInProgress = false;
        return { success: false, error: "Backend is not available" };
      }

      const localBookings = storageService.getBookings();

      const remoteBookings = await apiService.getAllBookings();

      const mergedBookings = mergeBookings(localBookings, remoteBookings);

      storageService.saveBookings(mergedBookings);

      storageService.saveSyncMetadata({
        lastSync: new Date().toISOString(),
        lastSyncId: remoteBookings.length > 0 ? remoteBookings[0].id : null,
        pendingSync: false,
      });

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

  getAllBookings(): Booking[] {
    const bookings = storageService.getBookings();
    return [...bookings].sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return dateA.getTime() - dateB.getTime();
    });
  },

  getBookingById(id: string): Booking | undefined {
    const bookings = storageService.getBookings();
    return bookings.find((booking) => booking.id === id);
  },

  async createBooking(data: BookingFormData): Promise<Booking> {
    const now = new Date().toISOString();
    const newBooking: Booking = {
      id: `booking-${nextId++}`,
      ...data,
      status: "confirmed",
      createdAt: now,
      updatedAt: now,
    };

    const bookings = storageService.getBookings();
    bookings.push(newBooking);
    storageService.saveBookings(bookings);

    if (isBackendAvailable) {
      this.syncWithBackend().catch((error) => {
        console.error("Failed to sync after create:", error);
        const metadata = storageService.getSyncMetadata();
        storageService.saveSyncMetadata({
          ...metadata,
          pendingSync: true,
        });
      });

      try {
        const backendBooking = await apiService.createBooking(data);
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
      }
    }

    return newBooking;
  },

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

    if (isBackendAvailable) {
      this.syncWithBackend().catch((error) => {
        console.error("Failed to sync after update:", error);
        const metadata = storageService.getSyncMetadata();
        storageService.saveSyncMetadata({
          ...metadata,
          pendingSync: true,
        });
      });

      try {
        const backendBooking = await apiService.updateBooking(id, data);
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
      }
    }

    return updatedBooking;
  },

  async deleteBooking(id: string): Promise<boolean> {
    const bookings = storageService.getBookings();
    const index = bookings.findIndex((booking) => booking.id === id);
    if (index === -1) return false;

    bookings.splice(index, 1);
    storageService.saveBookings(bookings);

    if (isBackendAvailable) {
      this.syncWithBackend().catch((error) => {
        console.error("Failed to sync after delete:", error);
        const metadata = storageService.getSyncMetadata();
        storageService.saveSyncMetadata({
          ...metadata,
          pendingSync: true,
        });
      });

      try {
        await apiService.deleteBooking(id);
      } catch (error) {
        console.error(
          "Failed to delete on backend, using local deletion:",
          error,
        );
      }
    }

    return true;
  },

  getBookingsByDate(date: string): Booking[] {
    const bookings = storageService.getBookings();
    return bookings.filter((booking) => booking.date === date);
  },

  async isTimeSlotAvailable(
    date: string,
    time: string,
    duration: number,
    excludeBookingId?: string,
  ): Promise<boolean> {
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
      }
    }

    return true;
  },

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

bookingService.checkBackend().catch(() => {
  // Backend not available, continue with localStorage only
});
