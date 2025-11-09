export interface Booking {
  id: string
  name: string
  email: string
  date: string
  time: string
  duration: number // in minutes
  notes?: string
  status: 'confirmed' | 'pending' | 'cancelled'
  createdAt: string
  updatedAt: string
}

export interface BookingFormData {
  name: string
  email: string
  date: string
  time: string
  duration: number
  notes?: string
}

export interface TimeSlot {
  time: string
  available: boolean
}

export interface DayAvailability {
  date: string
  available: boolean
  slots: TimeSlot[]
}

