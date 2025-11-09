import type { Booking, BookingFormData } from '../types/booking'

// In-memory storage for demo purposes
// In a real app, this would be replaced with API calls
let bookings: Booking[] = []
let nextId = 1

export const bookingService = {
  // Get all bookings
  getAllBookings: (): Booking[] => {
    return [...bookings].sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`)
      const dateB = new Date(`${b.date}T${b.time}`)
      return dateA.getTime() - dateB.getTime()
    })
  },

  // Get booking by ID
  getBookingById: (id: string): Booking | undefined => {
    return bookings.find((booking) => booking.id === id)
  },

  // Create a new booking
  createBooking: (data: BookingFormData): Booking => {
    const now = new Date().toISOString()
    const newBooking: Booking = {
      id: `booking-${nextId++}`,
      ...data,
      status: 'confirmed',
      createdAt: now,
      updatedAt: now,
    }
    bookings.push(newBooking)
    return newBooking
  },

  // Update a booking
  updateBooking: (id: string, data: Partial<BookingFormData>): Booking | null => {
    const index = bookings.findIndex((booking) => booking.id === id)
    if (index === -1) return null

    bookings[index] = {
      ...bookings[index],
      ...data,
      updatedAt: new Date().toISOString(),
    }
    return bookings[index]
  },

  // Delete a booking
  deleteBooking: (id: string): boolean => {
    const index = bookings.findIndex((booking) => booking.id === id)
    if (index === -1) return false

    bookings.splice(index, 1)
    return true
  },

  // Get bookings for a specific date
  getBookingsByDate: (date: string): Booking[] => {
    return bookings.filter((booking) => booking.date === date)
  },

  // Check if a time slot is available
  isTimeSlotAvailable: (date: string, time: string, duration: number, excludeBookingId?: string): boolean => {
    const requestedStart = new Date(`${date}T${time}`)
    const requestedEnd = new Date(requestedStart.getTime() + duration * 60000)

    return !bookings.some((booking) => {
      if (excludeBookingId && booking.id === excludeBookingId) return false

      const bookingStart = new Date(`${booking.date}T${booking.time}`)
      const bookingEnd = new Date(bookingStart.getTime() + booking.duration * 60000)

      // Check for overlap
      return (
        (requestedStart >= bookingStart && requestedStart < bookingEnd) ||
        (requestedEnd > bookingStart && requestedEnd <= bookingEnd) ||
        (requestedStart <= bookingStart && requestedEnd >= bookingEnd)
      )
    })
  },
}

