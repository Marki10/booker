import { describe, it, expect, beforeEach, vi } from "vitest";

// In-memory fakes for storage and api
const makeStorage = () => {
  let bookings: any[] = [];
  let syncMeta = {
    lastSync: null as string | null,
    lastSyncId: null as string | null,
    pendingSync: false,
  };
  return {
    getBookings: () => bookings,
    saveBookings: (b: any[]) => {
      bookings = JSON.parse(JSON.stringify(b));
    },
    getSyncMetadata: () => ({ ...syncMeta }),
    saveSyncMetadata: (m: typeof syncMeta) => {
      syncMeta = { ...m };
    },
    __setBookings: (b: any[]) => (bookings = JSON.parse(JSON.stringify(b))),
    __getState: () => ({ bookings, syncMeta }),
  };
};

const makeApi = () => {
  return {
    getAllBookings: vi.fn(async () => [] as any[]),
    createBooking: vi.fn(async (data: any) => ({
      id: "booking-remote-1",
      status: "confirmed",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...data,
    })),
    updateBooking: vi.fn(async (id: string, data: any) => ({
      id,
      status: "confirmed",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...data,
    })),
    deleteBooking: vi.fn(async () => {}),
    checkAvailability: vi.fn(async () => true),
  };
};

// Mocks must be defined before importing the module under test
vi.mock("../storageService", () => {
  const storage = makeStorage();
  return {
    storageService: storage as any,
    // expose for tests to access internal state (not used by the SUT)
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

// Helper to import fresh module each test so module-level state resets
const importService = async () => {
  const mod = await import("../bookingService");
  return mod.bookingService;
};

// Access to mocks
const getStorageMock = async () =>
  ((await import("../storageService")) as any).__storage;
const getApiMock = async () => ((await import("../apiService")) as any).__api;

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
    // overlaps existing 09:00-10:00
    await expect(
      svc.isTimeSlotAvailable("2025-11-10", "09:30", 30),
    ).resolves.toBe(false);
    // non-overlapping
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
    (api.getAllBookings as any).mockResolvedValueOnce([
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
    // merged contains both ids
    const ids = state.bookings.map((b: any) => b.id).sort();
    expect(ids).toEqual(["booking-1", "booking-2"]);
  });
});
