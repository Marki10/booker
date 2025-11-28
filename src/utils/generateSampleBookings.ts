import type { BookingFormData } from '../types/booking'
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
      date: getFutureDate(2), // 2 days from now
      time: '10:00',
      duration: 60,
      notes: 'Follow-up consultation',
    },
    {
      name: 'Sarah Johnson',
      email: 'sarah.j@example.com',
      date: getFutureDate(5), // 5 days from now
      time: '14:30',
      duration: 90,
      notes: 'Initial consultation - please bring previous medical records',
    },
    {
      name: 'Michael Chen',
      email: 'm.chen@example.com',
      date: getFutureDate(7), // 7 days from now
      time: '11:00',
      duration: 30,
      notes: 'Quick check-up',
    },
  ]

  // Create each booking
  for (const bookingData of sampleBookings) {
    try {
      await bookingService.createBooking(bookingData)
    } catch (error) {
      console.error('Error creating sample booking:', error)
    }
  }
}

