import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock axios module
vi.mock("axios", async () => {
  const actual = await vi.importActual("axios");
  const mockAxiosInstance = {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  };
  return {
    ...actual,
    default: {
      ...actual.default,
      create: vi.fn(() => mockAxiosInstance),
      isAxiosError: vi.fn((error: unknown) => {
        return error instanceof Error && "response" in error;
      }),
    },
  };
});

describe("apiService", () => {
  const testData = {
    list: [{ id: "booking-1" }],
    createPayload: {
      name: "Alice",
      email: "a@example.com",
      date: "2025-11-10",
      time: "09:00",
      duration: 60,
      notes: "n/a",
    },
    createResponse: { id: "booking-123", name: "Alice" },
    deleteId: "booking-1",
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  it("getAllBookings returns parsed data on success", async () => {
    const axios = await import("axios");
    const axiosInstance = axios.default.create({});
    (axiosInstance.get as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: testData.list,
    });

    const { apiService } = await import("../apiService");
    const data = await apiService.getAllBookings();
    expect(Array.isArray(data)).toBe(true);
    const first = (data as Array<{ id: string }>)[0];
    expect(first).toHaveProperty("id", testData.list[0].id);
  });

  it("createBooking posts data and returns created booking", async () => {
    const axios = await import("axios");
    const axiosInstance = axios.default.create({});
    (axiosInstance.post as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: testData.createResponse,
    });

    const { apiService } = await import("../apiService");
    const created = await apiService.createBooking(testData.createPayload);
    expect(created.id).toBe(testData.createResponse.id);
  });

  it("deleteBooking sends DELETE and resolves on success", async () => {
    const axios = await import("axios");
    const axiosInstance = axios.default.create({});
    (axiosInstance.delete as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: undefined,
    });

    const { apiService } = await import("../apiService");
    await expect(apiService.deleteBooking(testData.deleteId)).resolves.toBeUndefined();
  });

  it("checkBackendAvailable returns false on error", async () => {
    const axios = await import("axios");
    const axiosInstance = axios.default.create({});
    (axiosInstance.get as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error("network"),
    );

    const { checkBackendAvailable } = await import("../apiService");
    const ok = await checkBackendAvailable();
    expect(ok).toBe(false);
  });
});
