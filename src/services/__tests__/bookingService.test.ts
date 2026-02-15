import { describe, it, expect, beforeEach, vi } from "vitest";
import type { Booking } from "../../types/interfaces";

const makeStorage = () => {
  let bookings: Booking[] = [];
  let syncMeta = {
    lastSync: null as string | null,
    lastSyncId: null as string | null,
    pendingSync: false,
  };
  return {
    getBookings: (): Booking[] => bookings,
    saveBookings: (b: Booking[]) => {
      bookings = JSON.parse(JSON.stringify(b));
    },
    getSyncMetadata: () => ({ ...syncMeta }),
    saveSyncMetadata: (m: typeof syncMeta) => {
      syncMeta = { ...m };
    },
    __setBookings: (b: Booking[]) => (bookings = JSON.parse(JSON.stringify(b))),
    __getState: () => ({ bookings, syncMeta }),
  };
};

const makeApi = () => {
  return {
    getAllBookings: vi.fn(async (): Promise<Booking[]> => []),
    createBooking: vi.fn(async (data: Partial<Booking>): Promise<Booking> => ({
      id: "booking-remote-1",
      name: data.name ?? "Remote",
      email: data.email ?? "remote@example.com",
      date: data.date ?? "2025-01-01",
      time: data.time ?? "09:00",
      duration: data.duration ?? 60,
      notes: data.notes,
      status: "confirmed",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })),
    updateBooking: vi.fn(async (id: string, data: Partial<Booking>): Promise<Booking> => ({
      id,
      name: data.name ?? "Updated",
      email: data.email ?? "updated@example.com",
      date: data.date ?? "2025-01-01",
      time: data.time ?? "09:00",
      duration: data.duration ?? 60,
      notes: data.notes,
      status: "confirmed",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })),
    deleteBooking: vi.fn(async (): Promise<void> => {}),
    checkAvailability: vi.fn(async (): Promise<boolean> => true),
  };
};

vi.mock("../storageService", () => {
  const storage = makeStorage();
  return {
    storageService: storage,
    __storage: storage,
  };
});

let backendAvailable = false;
vi.mock("../apiService", () => {
  const api = makeApi();
  return {
    apiService: api,
    checkBackendAvailable: vi.fn(async () => backendAvailable),
    __api: api,
  };
});

const importService = async () => {
  const mod = await import("../bookingService");
  return mod.bookingService;
};

const getStorageMock = async () =>
  ((await import("../storageService")) as unknown as {
    __storage: ReturnType<typeof makeStorage>;
  }).__storage;
const getApiMock = async () =>
  ((await import("../apiService")) as unknown as {
    __api: ReturnType<typeof makeApi>;
  }).__api;

describe("bookingService", () => {
  beforeEach(async () => {
    vi.resetModules();
    backendAvailable = false;
  });

  it("getAllBookings returns sorted by date/time", async () => {
    const storage = await getStorageMock();
    storage.__setBookings([
      {
        id: "booking-2",
        name: "B",
        email: "b",
        date: "2025-11-11",
        time: "10:00",
        duration: 30,
        status: "confirmed",
        createdAt: "",
        updatedAt: "",
      },
      {
        id: "booking-1",
        name: "A",
        email: "a",
        date: "2025-11-10",
        time: "09:00",
        duration: 60,
        status: "confirmed",
        createdAt: "",
        updatedAt: "",
      },
    ]);
    const svc = await importService();
    const list = svc.getAllBookings();
    expect(list[0].id).toBe("booking-1");
    expect(list[1].id).toBe("booking-2");
  });

  it("createBooking saves locally and returns booking", async () => {
    const storage = await getStorageMock();
    storage.__setBookings([]);
    const svc = await importService();
    const created = await svc.createBooking({
      name: "C",
      email: "c@e.com",
      date: "2025-11-12",
      time: "11:00",
      duration: 30,
      notes: "",
    });
    const state = storage.__getState();
    expect(state.bookings).toHaveLength(1);
    expect(created.id).toMatch(/^booking-\d+/);
  });

  it("updateBooking modifies existing booking", async () => {
    const now = new Date().toISOString();
    const storage = await getStorageMock();
    storage.__setBookings([
      {
        id: "booking-1",
        name: "X",
        email: "x",
        date: "2025-11-10",
        time: "09:00",
        duration: 60,
        status: "confirmed",
        createdAt: now,
        updatedAt: now,
      },
    ]);
    const svc = await importService();
    const updated = await svc.updateBooking("booking-1", { name: "Y" });
    expect(updated?.name).toBe("Y");
    const state = storage.__getState();
    expect(state.bookings[0].name).toBe("Y");
  });

  it("deleteBooking removes booking", async () => {
    const now = new Date().toISOString();
    const storage = await getStorageMock();
    storage.__setBookings([
      {
        id: "booking-1",
        name: "X",
        email: "x",
        date: "2025-11-10",
        time: "09:00",
        duration: 60,
        status: "confirmed",
        createdAt: now,
        updatedAt: now,
      },
    ]);
    const svc = await importService();
    const ok = await svc.deleteBooking("booking-1");
    expect(ok).toBe(true);
    const state = storage.__getState();
    expect(state.bookings).toHaveLength(0);
  });

  it("isTimeSlotAvailable detects conflicts", async () => {
    const now = new Date().toISOString();
    const storage = await getStorageMock();
    storage.__setBookings([
      {
        id: "booking-1",
        name: "X",
        email: "x",
        date: "2025-11-10",
        time: "09:00",
        duration: 60,
        status: "confirmed",
        createdAt: now,
        updatedAt: now,
      },
    ]);
    const svc = await importService();
    await expect(
      svc.isTimeSlotAvailable("2025-11-10", "09:30", 30),
    ).resolves.toBe(false);
    await expect(
      svc.isTimeSlotAvailable("2025-11-10", "10:00", 30),
    ).resolves.toBe(true);
  });

  it("syncWithBackend merges when backend available", async () => {
    backendAvailable = true;
    const storage = await getStorageMock();
    const api = await getApiMock();
    storage.__setBookings([
      {
        id: "booking-1",
        name: "Local",
        email: "l",
        date: "2025-11-10",
        time: "09:00",
        duration: 60,
        status: "confirmed",
        createdAt: "",
        updatedAt: "",
      },
    ]);
    (api.getAllBookings as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce([
      {
        id: "booking-2",
        name: "Remote",
        email: "r",
        date: "2025-11-11",
        time: "10:00",
        duration: 30,
        status: "confirmed",
        createdAt: "",
        updatedAt: "",
      },
    ]);
    const svc = await importService();
    const res = await svc.syncWithBackend();
    expect(res.success).toBe(true);
    const state = storage.__getState();
    const ids = (state.bookings as Booking[]).map((b) => b.id).sort();
    expect(ids).toEqual(["booking-1", "booking-2"]);
  });

  it("syncWithBackend deduplicates equivalent bookings with different ids", async () => {
    backendAvailable = true;
    const storage = await getStorageMock();
    const api = await getApiMock();
    storage.__setBookings([
      {
        id: "booking-local",
        name: "Alice",
        email: "alice@example.com",
        date: "2025-11-15",
        time: "09:00",
        duration: 60,
        status: "confirmed",
        createdAt: "2025-11-10T10:00:00.000Z",
        updatedAt: "2025-11-10T10:00:00.000Z",
      },
    ]);
    (api.getAllBookings as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce([
      {
        id: "booking-remote",
        name: "Alice",
        email: "alice@example.com",
        date: "2025-11-15",
        time: "09:00",
        duration: 60,
        status: "confirmed",
        createdAt: "2025-11-10T10:00:00.000Z",
        updatedAt: "2025-11-10T11:00:00.000Z",
      },
    ]);
    const svc = await importService();
    const res = await svc.syncWithBackend();
    expect(res.success).toBe(true);
    const state = storage.__getState();
    expect(state.bookings).toHaveLength(1);
    expect((state.bookings as Booking[])[0].id).toBe("booking-remote");
  });
});
