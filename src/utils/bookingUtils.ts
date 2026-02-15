import type { Booking, BookingFormData } from "../types/interfaces";

export const bookingToFormData = (booking: Booking): BookingFormData => {
  return {
    name: booking.name,
    email: booking.email,
    date: booking.date,
    time: booking.time,
    duration: booking.duration,
    notes: booking.notes,
  };
};
