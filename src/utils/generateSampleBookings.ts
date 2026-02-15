import type { BookingFormData } from '../types/interfaces'
import { bookingService } from '../services/bookingService'

const getFutureDate = (daysFromNow: number): string => {
  const date = new Date()
  date.setDate(date.getDate() + daysFromNow)
  return date.toISOString().split('T')[0]
}

export const generateSampleBookings = async (): Promise<void> => {
  const sampleBookings: BookingFormData[] = [
    {
      name: 'John Smith',
      email: 'john.smith@example.com',
      date: getFutureDate(2),
      time: '10:00',
      duration: 60,
      notes: 'Follow-up consultation',
    },
    {
      name: 'Sarah Johnson',
      email: 'sarah.j@example.com',
      date: getFutureDate(5),
      time: '14:30',
      duration: 90,
      notes: 'Initial consultation - please bring previous medical records',
    },
    {
      name: 'Michael Chen',
      email: 'm.chen@example.com',
      date: getFutureDate(7),
      time: '11:00',
      duration: 30,
      notes: 'Quick check-up',
    },
  ]

  await bookingService.syncWithBackend()
  const buildBookingKey = (
    booking: Pick<BookingFormData, 'name' | 'email' | 'date' | 'time' | 'duration'>,
  ): string =>
    [
      booking.name.trim().toLowerCase(),
      booking.email.trim().toLowerCase(),
      booking.date,
      booking.time,
      booking.duration,
    ].join('|')

  const existingBookingKeys = new Set(
    bookingService.getAllBookings().map((booking) => buildBookingKey(booking)),
  )

  for (const bookingData of sampleBookings) {
    const bookingKey = buildBookingKey(bookingData)
    if (existingBookingKeys.has(bookingKey)) {
      continue
    }
    try {
      await bookingService.createBooking(bookingData)
      existingBookingKeys.add(bookingKey)
    } catch (error) {
      console.error('Error creating sample booking:', error)
    }
  }
}

