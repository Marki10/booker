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
      mockResponse([{ id: 'booking-1' }])
    )

    const data = await apiService.getAllBookings()
    expect(Array.isArray(data)).toBe(true)
    expect((data as any)[0]).toHaveProperty('id', 'booking-1')
  })

  it('createBooking posts data and returns created booking', async () => {
    ;(globalThis.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      mockResponse({ id: 'booking-123', name: 'Alice' })
    )
    const created = await apiService.createBooking({
      name: 'Alice',
      email: 'a@example.com',
      date: '2025-11-10',
      time: '09:00',
      duration: 60,
      notes: 'n/a',
    })
    expect(created.id).toBe('booking-123')
  })

  it('deleteBooking sends DELETE and resolves on 200', async () => {
    ;(globalThis.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      new Response(null, { status: 200 })
    )
    await expect(apiService.deleteBooking('booking-1')).resolves.toBeUndefined()
  })

  it('checkBackendAvailable returns false on error', async () => {
    ;(globalThis.fetch as unknown as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('network'))
    const ok = await checkBackendAvailable()
    expect(ok).toBe(false)
  })
})
