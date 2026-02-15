import { X } from "lucide-react";
import type { FormModalProps } from "../../types/interfaces";
import { BookingForm } from "../BookingForm";

export const FormModal = ({
  editingBooking,
  onSubmit,
  onCancel,
}: FormModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm"
        aria-hidden="true"
        onClick={onCancel}
      />
      {/* Modal panel */}
      <div
        className="relative w-full max-w-2xl mx-auto mt-6 sm:mt-12 mb-6 sm:mb-12 px-3 sm:px-4"
        data-testid="booking-form-modal"
      >
        <div className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-2xl border border-gray-200/50 p-4 sm:p-6 lg:p-8 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-start justify-between mb-4 sm:mb-6 lg:mb-8 pb-4 border-b border-gray-200 sticky top-0 bg-white/90 backdrop-blur-sm -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 pt-2 rounded-t-xl">
            <div className="flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {editingBooking ? "Edit Booking" : "Create New Booking"}
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1 hidden sm:block">
                {editingBooking
                  ? "Update your booking details"
                  : "Fill in the form to create a new booking"}
              </p>
            </div>
            <button
              onClick={onCancel}
              className="ml-2 p-2 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:rotate-90 min-w-[44px] min-h-[44px] flex items-center justify-center touch-manipulation flex-shrink-0 cursor-pointer"
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
      </div>
    </div>
  );
};
