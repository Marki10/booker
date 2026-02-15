import { describe, it, expect, beforeEach, vi } from "vitest";
import { storageService } from "../storageService";
import type { Booking } from "../../types/interfaces";

describe("storageService", () => {
  const STORAGE_KEY = "booker_bookings";
  const SYNC_META_KEY = "booker_sync_meta";

  beforeEach(() => {
    // Reset localStorage
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it("getBookings returns [] when nothing stored", () => {
    const bookings = storageService.getBookings();
    expect(bookings).toEqual([]);
  });

  it("saveBookings persists and getBookings reads back", () => {
    const sample: Booking[] = [
      {
        id: "booking-1",
        name: "Alice",
        email: "a@example.com",
        date: "2025-11-10",
        time: "09:00",
        duration: 60,
        status: "confirmed",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    storageService.saveBookings(sample);
    const raw = window.localStorage.getItem(STORAGE_KEY);
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw!);
    expect(parsed).toHaveLength(1);

    const readBack = storageService.getBookings();
    expect(readBack).toEqual(sample);
  });

  it("getSyncMetadata returns defaults when missing", () => {
    const meta = storageService.getSyncMetadata();
    expect(meta).toEqual({
      lastSync: null,
      lastSyncId: null,
      pendingSync: false,
    });
  });

  it("saveSyncMetadata persists and getSyncMetadata reads back", () => {
    const now = new Date().toISOString();
    storageService.saveSyncMetadata({
      lastSync: now,
      lastSyncId: "booking-1",
      pendingSync: true,
    });
    const raw = window.localStorage.getItem(SYNC_META_KEY);
    expect(raw).not.toBeNull();

    const meta = storageService.getSyncMetadata();
    expect(meta).toEqual({
      lastSync: now,
      lastSyncId: "booking-1",
      pendingSync: true,
    });
  });

  it("clearAll removes stored data", () => {
    window.localStorage.setItem(STORAGE_KEY, "[]");
    window.localStorage.setItem(SYNC_META_KEY, "{}");
    storageService.clearAll();
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull();
    expect(window.localStorage.getItem(SYNC_META_KEY)).toBeNull();
  });

  it("isAvailable returns true in jsdom environment", () => {
    expect(storageService.isAvailable()).toBe(true);
  });
});
