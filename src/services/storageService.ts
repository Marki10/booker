import type { Booking } from "../types/booking";

const STORAGE_KEY = "booker_bookings";
const SYNC_META_KEY = "booker_sync_meta";

export interface SyncMetadata {
  lastSync: string | null;
  lastSyncId: string | null;
  pendingSync: boolean;
}

export const storageService = {
  // Get all bookings from localStorage
  getBookings(): Booking[] {
    if (typeof window === "undefined" || !this.isAvailable()) {
      return [];
    }
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      return JSON.parse(stored);
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return [];
    }
  },

  // Save bookings to localStorage
  saveBookings(bookings: Booking[]): void {
    if (typeof window === "undefined" || !this.isAvailable()) {
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
      // Handle quota exceeded error
      if (error instanceof Error && error.name === "QuotaExceededError") {
        throw new Error(
          "Local storage quota exceeded. Please clear some data.",
        );
      }
    }
  },

  // Get sync metadata
  getSyncMetadata(): SyncMetadata {
    if (typeof window === "undefined" || !this.isAvailable()) {
      return {
        lastSync: null,
        lastSyncId: null,
        pendingSync: false,
      };
    }
    try {
      const stored = localStorage.getItem(SYNC_META_KEY);
      if (!stored) {
        return {
          lastSync: null,
          lastSyncId: null,
          pendingSync: false,
        };
      }
      return JSON.parse(stored);
    } catch (error) {
      console.error("Error reading sync metadata:", error);
      return {
        lastSync: null,
        lastSyncId: null,
        pendingSync: false,
      };
    }
  },

  // Save sync metadata
  saveSyncMetadata(metadata: SyncMetadata): void {
    if (typeof window === "undefined" || !this.isAvailable()) {
      return;
    }
    try {
      localStorage.setItem(SYNC_META_KEY, JSON.stringify(metadata));
    } catch (error) {
      console.error("Error saving sync metadata:", error);
    }
  },

  // Clear all data
  clearAll(): void {
    if (typeof window === "undefined" || !this.isAvailable()) {
      return;
    }
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(SYNC_META_KEY);
    } catch (error) {
      console.error("Error clearing localStorage:", error);
    }
  },

  // Check if localStorage is available
  isAvailable(): boolean {
    if (typeof window === "undefined") {
      return false;
    }
    try {
      const test = "__storage_test__";
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  },
};
