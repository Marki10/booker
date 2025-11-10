import type { Booking, BookingFormData } from '../types/booking'

export const bookingToFormData = (booking: Booking): BookingFormData => {
  return {
    name: booking.name,
    email: booking.email,
    date: booking.date,
    time: booking.time,
    duration: booking.duration,
    notes: booking.notes,
  }
}

