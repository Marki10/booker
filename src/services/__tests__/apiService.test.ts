import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { apiService, checkBackendAvailable } from '../apiService'

const mockResponse = (body: unknown, init?: Partial<Response>) =>
  new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
    ...init,
  } as ResponseInit)

describe('apiService', () => {
  const originalFetch = globalThis.fetch

  const testData = {
    list: [{ id: 'booking-1' }],
    createPayload: {
      name: 'Alice',
      email: 'a@example.com',
      date: '2025-11-10',
      time: '09:00',
      duration: 60,
      notes: 'n/a',
    },
    createResponse: { id: 'booking-123', name: 'Alice' },
    deleteId: 'booking-1',
  }

  beforeEach(() => {
    vi.useRealTimers()
    globalThis.fetch = vi.fn() as any
  })

  afterEach(() => {
    globalThis.fetch = originalFetch
    vi.restoreAllMocks()
  })

  it('getAllBookings returns parsed data on success', async () => {
    ;(globalThis.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      mockResponse(testData.list)
    )

    const data = await apiService.getAllBookings()
    expect(Array.isArray(data)).toBe(true)
    expect((data as any)[0]).toHaveProperty('id', testData.list[0].id)
  })

  it('createBooking posts data and returns created booking', async () => {
    ;(globalThis.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      mockResponse(testData.createResponse)
    )
    const created = await apiService.createBooking(testData.createPayload)
    expect(created.id).toBe(testData.createResponse.id)
  })

  it('deleteBooking sends DELETE and resolves on 200', async () => {
    ;(globalThis.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      new Response(null, { status: 200 })
    )
    await expect(apiService.deleteBooking(testData.deleteId)).resolves.toBeUndefined()
  })

  it('checkBackendAvailable returns false on error', async () => {
    ;(globalThis.fetch as unknown as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('network'))
    const ok = await checkBackendAvailable()
    expect(ok).toBe(false)
  })
})
