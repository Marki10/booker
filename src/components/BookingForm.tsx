import { useState } from 'react'
import type { FormEvent } from 'react'
import type { BookingFormData } from '../types/booking'
import { bookingService } from '../services/bookingService'
import { getTimeSlots, getTodayDate, isPastDateTime } from '../utils/dateUtils'
import { validateBookingForm } from '../utils/validation'
import { Calendar, Clock, User, Mail, FileText } from 'lucide-react'

interface BookingFormProps {
  onSubmit: (booking: BookingFormData) => void | Promise<void>
  onCancel?: () => void
  initialData?: Partial<BookingFormData>
}

export const BookingForm = ({ onSubmit, onCancel, initialData }: BookingFormProps) => {
  const [formData, setFormData] = useState<BookingFormData>({
    name: initialData?.name || '',
    email: initialData?.email || '',
    date: initialData?.date || getTodayDate(),
    time: initialData?.time || '09:00',
    duration: initialData?.duration || 60,
    notes: initialData?.notes || '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const timeSlots = getTimeSlots(9, 17, 30)
  const durationOptions = [15, 30, 60, 90, 120, 180, 240]

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErrors({})

    const validationErrors = validateBookingForm(
      formData.name,
      formData.email,
      formData.date,
      formData.time,
      formData.duration
    )

    if (validationErrors.length > 0) {
      const errorMap: Record<string, string> = {}
      validationErrors.forEach((error) => {
        errorMap[error.field] = error.message
      })
      setErrors(errorMap)
      return
    }

    // Check if time slot is available
    // Note: We don't have the booking ID here when editing, so we check availability
    // The backend will handle the conflict check properly
    const isAvailable = await bookingService.isTimeSlotAvailable(
      formData.date,
      formData.time,
      formData.duration
    )

    if (!isAvailable) {
      setErrors({
        time: 'This time slot is already booked. Please choose another time.',
      })
      return
    }

    // Check if date/time is in the past
    if (isPastDateTime(formData.date, formData.time)) {
      setErrors({
        date: 'Cannot book appointments in the past.',
      })
      return
    }

    onSubmit(formData)
  }

  const handleChange = (field: keyof BookingFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      <div>
        <label htmlFor="name" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
          <div className="p-1.5 bg-blue-100 rounded-lg">
            <User className="w-4 h-4 text-blue-600" />
          </div>
          Name
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className={`w-full px-4 py-3.5 sm:py-3 text-base border-2 rounded-xl focus:ring-2 focus:ring-offset-1 sm:focus:ring-offset-2 transition-all duration-200 touch-manipulation ${
            errors.name
              ? 'border-red-400 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-300'
          }`}
          placeholder="Enter your full name"
          required
          autoComplete="name"
        />
        {errors.name && (
          <p className="mt-2 text-sm text-red-600 flex items-center gap-1 animate-in slide-in-from-top-1">
            <span className="text-red-500">●</span>
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
          <div className="p-1.5 bg-purple-100 rounded-lg">
            <Mail className="w-4 h-4 text-purple-600" />
          </div>
          Email
        </label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          className={`w-full px-4 py-3.5 sm:py-3 text-base border-2 rounded-xl focus:ring-2 focus:ring-offset-1 sm:focus:ring-offset-2 transition-all duration-200 touch-manipulation ${
            errors.email
              ? 'border-red-400 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-300'
          }`}
          placeholder="your.email@example.com"
          required
          autoComplete="email"
          inputMode="email"
        />
        {errors.email && (
          <p className="mt-2 text-sm text-red-600 flex items-center gap-1 animate-in slide-in-from-top-1">
            <span className="text-red-500">●</span>
            {errors.email}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label htmlFor="date" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
            <div className="p-1.5 bg-green-100 rounded-lg">
              <Calendar className="w-4 h-4 text-green-600" />
            </div>
            Date
          </label>
          <input
            type="date"
            id="date"
            value={formData.date}
            onChange={(e) => handleChange('date', e.target.value)}
            min={getTodayDate()}
            className={`w-full px-4 py-3.5 sm:py-3 text-base border-2 rounded-xl focus:ring-2 focus:ring-offset-1 sm:focus:ring-offset-2 transition-all duration-200 touch-manipulation ${
              errors.date
                ? 'border-red-400 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-300'
            }`}
            required
          />
          {errors.date && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-1 animate-in slide-in-from-top-1">
              <span className="text-red-500">●</span>
              {errors.date}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="time" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
            <div className="p-1.5 bg-orange-100 rounded-lg">
              <Clock className="w-4 h-4 text-orange-600" />
            </div>
            Time
          </label>
          <select
            id="time"
            value={formData.time}
            onChange={(e) => handleChange('time', e.target.value)}
            className={`w-full px-4 py-3.5 sm:py-3 text-base border-2 rounded-xl focus:ring-2 focus:ring-offset-1 sm:focus:ring-offset-2 transition-all duration-200 cursor-pointer touch-manipulation ${
              errors.time
                ? 'border-red-400 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-300'
            }`}
            required
          >
            {timeSlots.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
          {errors.time && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-1 animate-in slide-in-from-top-1">
              <span className="text-red-500">●</span>
              {errors.time}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="duration" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
          <div className="p-1.5 bg-indigo-100 rounded-lg">
            <Clock className="w-4 h-4 text-indigo-600" />
          </div>
          Duration
        </label>
        <select
          id="duration"
          value={formData.duration}
          onChange={(e) => handleChange('duration', parseInt(e.target.value, 10))}
          className="w-full px-4 py-3.5 sm:py-3 text-base border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-300 transition-all duration-200 cursor-pointer touch-manipulation"
        >
          {durationOptions.map((duration) => (
            <option key={duration} value={duration}>
              {duration} minutes
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="notes" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
          <div className="p-1.5 bg-pink-100 rounded-lg">
            <FileText className="w-4 h-4 text-pink-600" />
          </div>
          Notes (optional)
        </label>
        <textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          rows={4}
          className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-300 transition-all duration-200 resize-none touch-manipulation"
          placeholder="Any additional notes or special requirements..."
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
        <button
          type="submit"
          className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3.5 sm:py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 min-h-[48px] text-base touch-manipulation"
        >
          {initialData ? 'Update Booking' : 'Create Booking'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-100 text-gray-700 py-3.5 sm:py-3 px-6 rounded-xl hover:bg-gray-200 transition-all duration-200 font-semibold border-2 border-gray-200 hover:border-gray-300 min-h-[48px] text-base touch-manipulation"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}

