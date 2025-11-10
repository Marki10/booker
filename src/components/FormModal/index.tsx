import { X } from 'lucide-react'
import type { BookingFormData } from '../../types/booking'
import { BookingForm } from '../BookingForm'

interface FormModalProps {
  editingBooking: (Partial<BookingFormData> & { id?: string }) | null
  onSubmit: (formData: BookingFormData) => void | Promise<void>
  onCancel: () => void
}

export const FormModal = ({ editingBooking, onSubmit, onCancel }: FormModalProps) => {
  return (
    <div
      className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-2xl border border-gray-200/50 p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6 lg:mb-8 animate-in fade-in slide-in-from-top-4 duration-300 max-h-[calc(100vh-120px)] overflow-y-auto"
      data-testid="booking-form-modal"
    >
      <div className="flex items-start justify-between mb-4 sm:mb-6 lg:mb-8 pb-4 border-b border-gray-200 sticky top-0 bg-white/90 backdrop-blur-sm -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 pt-2">
        <div className="flex-1 min-w-0">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {editingBooking ? 'Edit Booking' : 'Create New Booking'}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 hidden sm:block">
            {editingBooking ? 'Update your booking details' : 'Fill in the form to create a new booking'}
          </p>
        </div>
        <button
          onClick={onCancel}
          className="ml-2 p-2 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:rotate-90 min-w-[44px] min-h-[44px] flex items-center justify-center touch-manipulation flex-shrink-0"
          aria-label="Close form"
          data-testid="booking-form-close"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
        </button>
      </div>
      <BookingForm
        onSubmit={onSubmit}
        onCancel={onCancel}
        initialData={editingBooking || undefined}
        excludeBookingId={editingBooking?.id}
      />
    </div>
  )
}
